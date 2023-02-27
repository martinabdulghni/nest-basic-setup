import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule, RmqModule } from '@app/common';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';

@Module({
  imports: [AuthModule, RmqModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, RolesAuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
