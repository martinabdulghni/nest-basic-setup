import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TokenPayload } from 'apps/auth/src/auth.service';
import { CreateUserRequest } from 'apps/auth/src/users/dto/create-user.request';
import jwtDecode from 'jwt-decode';

@Injectable()
export class ProfileService {
  async modifyMyAccount(id: string, body: CreateUserRequest, request: Request) {
    // const token = request.cookies['Authentication'];
    // const userId: TokenPayload = await jwtDecode(token);
    // if (userId.userId === id) {
    //   try {
    //     const userToModify = await this.usersRepository.findOne({
    //       _id: id,
    //     });

    //     const { _id, lastLoggedIn, addedDate, history, isModified, modifiedDate, userRole, ...USER } = userToModify;

    //     if (body.password) {
    //       body.password = await bcrypt.hash(body.password, 10);
    //     }

    //     const user = await this.usersRepository.findOneAndUpdate(
    //       {
    //         _id: id,
    //       },
    //       {
    //         $set: {
    //           password: await bcrypt.hash(body.password, 10),
    //           isModified: true,
    //           ...body,
    //         },
    //         $currentDate: {
    //           modifiedDate: true,
    //         },
    //         $push: {
    //           history: { USER, modifiedDate: new Date() },
    //         },
    //       },
    //     );

    //     return HttpStatus.OK;
    //   } catch (error) {
    //     throw new NotFoundException(`No user with id: ${id} found`);
    //   }
    // }
  }
}
