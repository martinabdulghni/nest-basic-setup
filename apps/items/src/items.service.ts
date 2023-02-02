import { Injectable, Logger } from '@nestjs/common';
import { CreateItemRequest } from './dto/create-item.request';
import { ItemRepository } from './items.repository';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(private readonly itemRepository: ItemRepository) {}
  async createItem(request: CreateItemRequest, authentication: string) {
    const session = await this.itemRepository.startTransaction();
    try {
      const createdOrder = await this.itemRepository.create(request, {
        session,
      });
      this.logger.log('wewe', request);
      await session.commitTransaction();
      return createdOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getItems() {
    console.log(this.itemRepository.find({}));

    return this.itemRepository.find({});
  }
}
