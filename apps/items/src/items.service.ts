import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { CreateItemRequest } from './dto/create-item.request';
import { ItemRepository } from './items.repository';

@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: ItemRepository) {}
  // async createItem(request: CreateItemRequest, authentication: string, user: User) {
  //   const session = await this.itemRepository.startTransaction();
  //   try {
  //     if (user.isAdmin) {
  //       let newItem = {
  //         ...request,
  //         addedDate: new Date(),
  //         addedBy: user._id.toString(),
  //         isModified: false,
  //         history: [],
  //         modifiedDate: new Date(),
  //       };

  //       const createdOrder = await this.itemRepository.create(newItem, {
  //         session,
  //       });
  //       await session.commitTransaction();
  //       return createdOrder;
  //     }
  //     throw new ForbiddenException();
  //   } catch (error) {
  //     await session.abortTransaction();
  //     throw error;
  //   }
  // }

  // async getItems(user: User) {
  //   if (user.isAdmin) {
  //     return this.itemRepository.find({});
  //   }

  //   throw new ForbiddenException();
  // }

  // async modifyItem(id: string, user: User, request: CreateItemRequest) {
  //   try {
  //     const itemToModify = await this.itemRepository.findOne({
  //       _id: id,
  //     });

  //     let { history, _id, isModified, addedDate, addedBy, modifiedDate, ...item } = itemToModify;

  //     if (user.isAdmin || itemToModify.addedBy === user._id.toString()) {
  //       const order = await this.itemRepository.findOneAndUpdate(
  //         {
  //           _id: id,
  //         },
  //         {
  //           $set: {
  //             ...request,
  //             isModified: true,
  //           },
  //           $currentDate: {
  //             modifiedDate: true,
  //           },
  //           $push: {
  //             history: { item, modifiedDate: new Date() },
  //           },
  //         },
  //       );
  //       return order;
  //     }
  //     throw new ForbiddenException();
  //   } catch (error) {
  //     throw new NotFoundException(`No order with id: ${id} found`);
  //   }
  // }
}
