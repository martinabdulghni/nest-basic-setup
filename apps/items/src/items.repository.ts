
import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Items } from './schemas/items.schema';
@Injectable()
export class ItemRepository extends AbstractRepository<Items> {
    protected readonly logger = new Logger(ItemRepository.name);

    constructor(
      @InjectModel(Items.name) orderModel: Model<Items>,
      @InjectConnection() connection: Connection,
    ) {
      super(orderModel, connection);
    }
}


