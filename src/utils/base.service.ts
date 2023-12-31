import { NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';

export abstract class BaseService<Entity> {
  constructor(
    private readonly baseRepository: Repository<Entity>,
    private readonly messageNotFound?: string | 'Not found',
  ) {}

  async getAll(
    fields?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    relationOptions?: string[],
  ): Promise<Entity[]> {
    return await this.baseRepository.find({
      where: fields,
      relations: relationOptions,
    });
  }

  async getOne(
    fields: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    relationOptions?: string[],
  ): Promise<Entity> {
    return await this.baseRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async getAndCheckExist(
    fields: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    relationOptions?: string[],
  ): Promise<Entity> {
    let result: Entity;
    if (relationOptions) {
      result = await this.getOne(fields, relationOptions);
    } else {
      result = await this.getOne(fields);
    }
    if (!result) {
      throw new NotFoundException(this.messageNotFound);
    }
    return result;
  }
  /**This function filter out elements from arr1 that have an id not present in arr2.
   * @example
   * arr1: [1,2,3,4]
   * arr2: [1,4,5]
   * output: [2,3]
   */
  filterByIdIntersection(arr1: any[], arr2: any[]) {
    const set2 = new Set(arr2.map((obj) => obj.id));
    return arr1.filter((obj) => !set2.has(obj.id));
  }
}
