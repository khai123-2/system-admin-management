import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { generateHash } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  async createUser(data: CreateUserDto) {
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

    return newUser;
  }
}
