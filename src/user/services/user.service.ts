import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Equal, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { generateHash } from 'src/utils/bcrypt';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { BaseService } from 'src/utils/base.service';
import { UserAclService } from './user-acl.service';
import { UserAction } from '../actions/user-action';
import { AttachRolesDto } from '../dtos/remove-role';
import { RoleAction } from 'src/role/actions/role-action';
import { RoleService } from 'src/role/services/role.service';
import { RemoveRolesDto } from '../dtos/attach-role.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userAclService: UserAclService,
    private readonly roleService: RoleService,
  ) {
    super(userRepository);
  }
  async listUsers(user: User) {
    const ability = await this.userAclService.forActor(user);
    if (!ability.canDoAction(UserAction.List_Users)) {
      throw new UnauthorizedException();
    }
    const users = await this.getAll();

    return User.plainToClassArray(users);
  }

  async getUser(actor: User, userId: number) {
    const user = await this.getAndCheckExist({ id: userId }, ['roles']);

    const ability = await this.userAclService.forActor(actor);

    if (ability.canDoAction(UserAction.Get_User)) {
      return user;
    }

    if (ability.canDoAction(UserAction.Get_My_User, user)) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async createUser(actor: User, data: CreateUserDto): Promise<User> {
    const ability = await this.userAclService.forActor(actor);
    if (!ability.canDoAction(UserAction.Create_User)) {
      throw new UnauthorizedException();
    }
    const { username, password } = data;
    const user = await this.getOne({ username });
    if (user) {
      throw new BadRequestException('username is already exist');
    }
    const hashPassword = await generateHash(password);
    const newUser = await this.userRepository.save({
      ...data,
      password: hashPassword,
    });

    return User.plainToClass(newUser);
  }

  async updateUser(actor: User, userId: number, data: UpdateUserDto) {
    const user = await this.getAndCheckExist({ id: userId });

    const ability = await this.userAclService.forActor(actor);

    if (ability.canDoAction(UserAction.Update_User)) {
      return await this.checkBeforeUpdate(userId, data);
    }
    if (ability.canDoAction(UserAction.Update_My_User, user)) {
      return await this.checkBeforeUpdate(userId, data);
    }
    throw new UnauthorizedException();
  }

  async checkBeforeUpdate(userId: number, data: UpdateUserDto) {
    const checkUserNameExits = await this.getOne({
      username: data.username,
    });
    if (checkUserNameExits) {
      throw new BadRequestException('username is already exist');
    }
    return await this.userRepository.update(userId, data);
  }

  async deleteUser(actor: User, userId: number) {
    const user = await this.getAndCheckExist({ id: userId });
    const ability = await this.userAclService.forActor(actor);
    if (!ability.canDoAction(UserAction.Delete_User, user)) {
      throw new UnauthorizedException();
    }
    return await this.userRepository.delete(user.id);
  }

  async attachRoles(actor: User, userId: number, data: AttachRolesDto) {
    const ability = await this.userAclService.forActor(actor);
    if (!ability.canDoAction(UserAction.Add_Role_To_User)) {
      throw new UnauthorizedException();
    }
    const user = await this.getAndCheckExist({ id: userId }, ['roles']);
    if (data.roleIds.length > 0) {
      const roles = await this.roleService.listRolesFromIds(data.roleIds);
      user.roles.push(...roles);
    }
    return await this.userRepository.save(user);
  }

  async removeRoles(actor: User, userId: number, data: RemoveRolesDto) {
    const ability = await this.userAclService.forActor(actor);
    if (!ability.canDoAction(UserAction.Remove_Role_From_User)) {
      throw new UnauthorizedException();
    }
    const user = await this.getAndCheckExist({ id: userId }, ['roles']);
    if (data.roleIds.length > 0) {
      const rolesRemoved = await this.roleService.listRolesFromIds(
        data.roleIds,
      );

      const newRoles = this.getMissingObjects(user.roles, rolesRemoved);
      user.roles = newRoles;
    }
    return await this.userRepository.save(user);
  }
}
