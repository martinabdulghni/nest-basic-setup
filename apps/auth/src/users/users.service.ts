import { HttpStatus, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserRequest, ModifyUserRequest } from './dto/create-user.request';
import { User } from './schemas/user.schema';
import { UserConnectionStatus } from 'libs/types/user-status';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(request: CreateUserRequest) {
    await this.validateCreateUserRequest(request);
    const user = await this.usersRepository.create({
      ...request,
      lastLoggedIn: new Date(),
      userConnectionStatus: UserConnectionStatus.Online,
      password: await bcrypt.hash(request.password, 10),
      addedDate: new Date(),
      description: '',
      history: [],
      image: '',
      userAccountStatus: { isBanned: false, isModified: false, isTimedOut: false, isWarned: false, modifiedDate: false },
      userRole: {
        Super: false,
        SuperAdmin: false,
        Admin: false,
        SuperSupport: false,
        Support: false,
        SuperDeveloper: false,
        SuperEconomic: false,
        Economic: false,
        SuperUser: false,
        User: true,
      },
    });
    return { status: HttpStatus.OK, userId: user._id };
  }

  private async validateCreateUserRequest(request: CreateUserRequest) {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        email: request.email,
      });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
  async validateRole(user: User) {
    return user.userRole;
  }

  async getUser(getUserArgs: Partial<User>) {
    return this.usersRepository.findOne(getUserArgs);
  }

  async modifyUser(id: string, body: ModifyUserRequest) {
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    try {
      const userToModify = await this.usersRepository.findOne({
        _id: id,
      });

      const { _id, lastLoggedIn, addedDate, history, userRole, ...USER } = userToModify;

      await this.usersRepository.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            password: body.password ? await bcrypt.hash(body.password, 10) : userToModify.password,
            ...body,
            userAccountStatus: {
              isBanned: body.userAccountStatus.isBanned ? body.userAccountStatus.isBanned : userToModify.userAccountStatus.isBanned,
              isModified: body.userAccountStatus.isModified ? body.userAccountStatus.isModified : userToModify.userAccountStatus.isModified,
              isTimedOut: body.userAccountStatus.isTimedOut ? body.userAccountStatus.isTimedOut : userToModify.userAccountStatus.isTimedOut,
              isWarned: body.userAccountStatus.isWarned ? body.userAccountStatus.isWarned : userToModify.userAccountStatus.isWarned,
              modifiedDate: body.userAccountStatus.modifiedDate ? body.userAccountStatus.modifiedDate : userToModify.userAccountStatus.modifiedDate,
            },
          },
          $currentDate: {
            modifiedDate: true,
          },
          $push: {
            history: { USER, modifiedDate: new Date() },
          },
        },
      );

      return HttpStatus.OK;
    } catch (error) {
      throw new NotFoundException(`No user with id: ${id} found`);
    }
  }

  async getUsers() {
    try {
      return await this.usersRepository.find({});
    } catch (error) {
      throw new NotFoundException(`No Users`);
    }
  }
  async deleteUser(id: string) {
    try {
      const user = await this.usersRepository.findOne({ _id: id });
      if (user) {
        return await this.usersRepository.findOneAndDelete({
          _id: id,
        });
      }
    } catch (error) {
      throw new NotFoundException(`No Users`);
    }
  }

  async getUserById(id: string) {
    try {
      return await this.usersRepository.findOne({
        _id: id,
      });
    } catch (error) {
      throw new NotFoundException(`No Users`);
    }
  }
}
