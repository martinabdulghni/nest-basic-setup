import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { CreateItemRequest } from './dto/create-item.request';
import { ItemRepository } from './items.repository';

@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: ItemRepository) {}
  async createItem(
    request: CreateItemRequest,
    authentication: string,
    user: User,
  ) {
    const session = await this.itemRepository.startTransaction();
    try {
      if (user.isAdmin) {
        const createdOrder = await this.itemRepository.create(request, {
          session,
        });
        await session.commitTransaction();
        return createdOrder;
      }
      throw new ForbiddenException();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getItems(user: User) {
    if (user.isAdmin) {
      return this.itemRepository.find({});
    }

    throw new ForbiddenException();
  }
}
