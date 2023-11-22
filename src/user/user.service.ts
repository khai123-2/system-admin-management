import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { generateHash } from 'src/utils/bcrypt';
import { PermissionService } from 'src/permission/permission.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly permissionService: PermissionService,
  ) {}

  async getUser(
    fields: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    relationOptions?: string[],
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async getMyUser(actor: User, userId: number) {
    const user = await this.getUser({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  async createUser(actor: User, data: CreateUserDto): Promise<User> {
    const isAllowed = await this.permissionService
      .forActor(actor)
      .canDoAction('CreateUser');

    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    const { username, password } = data;
    const user = await this.getUser({ username });
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
    const user = await this.getUser({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isAllowed = await this.permissionService
      .forActor(actor)
      .canDoAction('UpdateUser');

    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    return await this.userRepository.update(userId, data);
  }

  async deleteUser(actor: User, userId: number) {
    const user = await this.getUser({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (actor.id === userId) {
      throw new UnauthorizedException('user can not delete my self');
    }
    const isAllowed = await this.permissionService
      .forActor(actor)
      .canDoAction('DeleteUser');

    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    return await this.userRepository.delete(user.id);
  }
}
