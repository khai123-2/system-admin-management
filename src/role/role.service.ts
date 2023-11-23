import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RoleService {
  async test() {
    throw new NotFoundException();
  }
}
