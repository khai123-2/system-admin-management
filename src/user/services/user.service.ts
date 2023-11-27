import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generateHash } from 'src/utils/bcrypt';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { BaseService } from 'src/utils/base.service';
import { UserAclService } from './user-acl.service';
import { UserAction } from '../actions/user-action';
import { RoleService } from 'src/role/services/role.service';
import { AttachRolesDto } from '../dtos/attach-role.dto';
import { RemoveRolesDto } from '../dtos/remove-role.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { EmployeeService } from 'src/employee/services/employee.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userAclService: UserAclService,
    private readonly roleService: RoleService,
    private readonly employeeService: EmployeeService,
  ) {
    super(userRepository, 'User not found');
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
    const user = await this.getAndCheckExist({ id: userId }, [
      'roles',
      'employee',
    ]);

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

    const newUser = this.userRepository.create();
    newUser.username = username;
    newUser.password = await generateHash(password);
    if (data.roleIds.length > 0) {
      const roles = await this.roleService.listRolesFromIds(data.roleIds);
      newUser.roles = roles;
    }
    const saveUser = await this.userRepository.save(newUser);
    return User.plainToClass(saveUser);
  }

  async updateUser(actor: User, userId: number, data: UpdateUserDto) {
    const user = await this.getAndCheckExist({ id: userId });

    const ability = await this.userAclService.forActor(actor);

    const employee = await this.employeeService.getAndCheckExist({
      id: data.employeeId,
    });

    if (!employee.user) {
      throw new BadRequestException();
    }
    user.employee = employee;

    if (ability.canDoAction(UserAction.Update_User)) {
      return await this.userRepository.update(userId, user);
    }
    if (ability.canDoAction(UserAction.Update_My_User, user)) {
      return await this.userRepository.update(userId, user);
    }
    throw new UnauthorizedException();
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
    const user = await this.getAndCheckExist({ id: userId }, ['roles']);
    const ability = await this.userAclService.forActor(actor);
    if (!ability.canDoAction(UserAction.Add_Role_To_User, user)) {
      throw new UnauthorizedException();
    }
    if (data.roleIds.length > 0) {
      const roles = await this.roleService.listRolesFromIds(data.roleIds);
      user.roles.push(...roles);
    }
    return await this.userRepository.save(user);
  }

  async removeRoles(actor: User, userId: number, data: RemoveRolesDto) {
    const user = await this.getAndCheckExist({ id: userId }, ['roles']);
    const ability = await this.userAclService.forActor(actor);
    if (!ability.canDoAction(UserAction.Remove_Role_From_User, user)) {
      throw new UnauthorizedException();
    }
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
