import { User } from 'apps/auth/src/users/schemas/user.schema';
import { IsString, IsNotEmpty, IsPositive, IsBoolean, IsArray, IsDate } from 'class-validator';

export class CreateJobQueueObject {
  name: string;
  desc: string;
  isActive: boolean;
  allocatedEmployees: string[];
  addedBy: string;
  customer: string;
  project: string;
  estimatedTime: number;
  estimatedPrice: number;
  estimatedDate: Date;
  addedDate: Date;
  allocatedOrder: String;
}
