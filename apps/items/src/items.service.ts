import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { CreateItemObject, CreateItemRequest } from './dto/create-item.request';
import { ItemRepository } from './items.repository';

@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async createItem(request: CreateItemRequest, user: User) {
    const session = await this.itemRepository.startTransaction();
    const item: CreateItemObject = this.createItemObject(request, user);

    try {
      const createdOrder = await this.itemRepository.create(item, {
        session,
      });
      await session.commitTransaction();
      return createdOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getItems() {
    return this.itemRepository.find({});
  }

  async modifyItem(id: string, request: CreateItemRequest) {
    try {
      const itemToModify = await this.itemRepository.findOne({
        _id: id,
      });

      const { history, _id, isModified, addedDate, addedBy, modifiedDate, ...item } = itemToModify;

      const order = await this.itemRepository.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            ...request,
            isModified: true,
          },
          $currentDate: {
            modifiedDate: true,
          },
          $push: {
            history: { item, modifiedDate: new Date() },
          },
        },
      );
      return order;
    } catch (error) {
      throw new NotFoundException(`No order with id: ${id} found`);
    }
  }

  async deletItem(id: string) {
    try {
      await this.itemRepository.findOne({
        _id: id,
      });
      await this.itemRepository.findOneAndDelete({
        _id: id,
      });
    } catch (error) {
      throw new BadRequestException('Couldnt delete item');
    }
  }

  private createItemObject(request: CreateItemRequest, user: User): CreateItemObject {
    return {
      ...request,
      addedDate: new Date(),
      addedBy: user._id.toString(),
      isModified: false,
      history: [],
      modifiedDate: new Date(),
    };
  }
}
