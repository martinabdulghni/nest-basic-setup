import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountingService {
  getHello(): string {
    return 'Hello World!';
  }
}
