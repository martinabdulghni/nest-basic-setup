import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { TokenPayload } from 'apps/auth/src/auth.service';
import { CreateUserRequest, ModifyProfileRequest } from 'apps/auth/src/users/dto/create-user.request';
import jwtDecode from 'jwt-decode';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { User, UserBasic } from 'apps/auth/src/users/schemas/user.schema';
import * as passwordValidator from 'password-validator';
import * as emailValidator from 'email-validator';
import { UserConnectionStatus, UserModifiedStatusType } from 'libs/types/user-status';
import validator from 'validator';
import { Response } from 'express';

@Injectable()
export class ProfileService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getProfile(request: Request): Promise<Object> {
    const token: TokenPayload = await jwtDecode(request.cookies['Authentication']);
    const id: string = token.userId;

    try {
      const user = await this.usersRepository.findOne({
        _id: id,
      });

      if (!(user.userRole.Admin || user.userRole.SuperAdmin || user.userRole.SuperDeveloper || user.userRole.Super)) {
        user.userRole = this.getUserRoles(user);
      }
      let { _id, history, password, userAccountStatus, lastLoggedIn, ...USER } = user;
      return USER;
    } catch (err) {
      throw new BadRequestException(`No user to modify`);
    }
  }
  async modifyProfile(response: Response, request: Request, body: ModifyProfileRequest) {
    // else: throw new badRequest
    if (body !== undefined) {
      const isEmail = emailValidator.validate(body.email);
      // else: throw new badRequest

      if (isEmail) {
        // UserBasic: Only spcific data to see
        const user: UserBasic = await this.getUserFromTokenPayLoad(request);

        if (Object.keys(body).length === 1 && Object.keys(body)[0] === 'email' && user.email === body.email) {
          throw new BadRequestException('Nothing To Modify');
        }

        // [OK] Validation
        let validationStatus: ValidationStatus = await this.validateBodyDataToModifyUser(body, user);

        if (Object.values(validationStatus).every(Boolean) && Object.values(validationStatus).every((key) => key === true)) {
          await this.modifyValidUser(user, body);
          response.clearCookie('Authentication');
          return HttpStatus.OK;
        } else {
          throw new BadRequestException(validationStatus);
        }
      }
    }
  }

  private async modifyValidUser(user: UserBasic, body: ModifyProfileRequest) {
    try {
      await this.usersRepository.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: {
            name: body.name !== undefined ? body.name : user.name,
            image: body.image !== undefined ? body.image : user.image,
            email: body.email !== undefined ? body.email : user.email,
            description: body.description !== undefined ? body.description : user.description,
            userConnectionStatus: body.userConnectionStatus !== undefined ? body.userConnectionStatus : user.userConnectionStatus,
            password: body.password !== undefined ? await bcrypt.hash(body.password, 10) : user.password,
          },
          $currentDate: {
            modifiedDate: true,
          },
          $push: {
            history: { user, modifiedDate: new Date() },
          },
        },
      );

      return HttpStatus.OK;
    } catch (error) {
      throw new BadRequestException(`Couldnt update user...`);
    }
  }

  private async validateBodyDataToModifyUser(body: ModifyProfileRequest, user: UserBasic): Promise<ValidationStatus> {
    // validation variables;
    let passwordCheck: UserModifiedStatusType = { isModified: false, isValid: false };
    let connectionStatusCheck: UserModifiedStatusType = { isModified: false, isValid: false };
    let emailCheck: UserModifiedStatusType = { isModified: false, isValid: false };

    //*@Password Validator
    if (body.password !== undefined) {
      passwordCheck.isModified = true;
    }
    if (body.password !== '') {
      if (this.validateModifyUserPassword(body, user) === true) {
        passwordCheck.isValid = true;
      }
    }
    //*@UserConnectionStatus Validator
    if (body.userConnectionStatus !== undefined) {
      connectionStatusCheck.isModified = true;
    }
    if (body.userConnectionStatus !== '') {
      if (this.validateModifyUserConnectionStatus(body.userConnectionStatus) === true) {
        connectionStatusCheck.isValid = true;
      }
    }

    //*@Email Validator
    if (body.email !== undefined) {
      emailCheck.isModified = true;
    }
    if (body.email !== '') {
      if (body.email !== user.email) {
        if ((await this.validateModifyUserEmail(body.email)) === true) {
          emailCheck.isValid = true;
        }
      } else {
        emailCheck.isValid = true;
      }
    }

    // Validation Booleans.
    const passwordValidate: boolean =
      (passwordCheck.isValid && passwordCheck.isModified) || (passwordCheck.isValid && !passwordCheck.isModified) || (!passwordCheck.isValid && !passwordCheck.isModified);

    const connectionStatusValidate: boolean =
      (connectionStatusCheck.isValid && connectionStatusCheck.isModified) ||
      (connectionStatusCheck.isValid && !connectionStatusCheck.isModified) ||
      (!connectionStatusCheck.isValid && !connectionStatusCheck.isModified);

    const emailValidate: boolean =
      (emailCheck.isValid && emailCheck.isModified) || (emailCheck.isValid && !emailCheck.isModified) || (!emailCheck.isValid && !emailCheck.isModified);

    let result: ValidationStatus = {
      password: passwordValidate === false ? this.validateModifyUserPassword(body, user) : true,
      connectionStatus: connectionStatusValidate,
      email: emailValidate,
    };

    return result;
  }

  private async getUserFromTokenPayLoad(request: Request): Promise<UserBasic> {
    const token: TokenPayload = jwtDecode(request.cookies['Authentication']);
    const id: string = token.userId;

    try {
      const user = await this.usersRepository.findOne({
        _id: id,
      });
      const { lastLoggedIn, addedDate, history, userRole, userAccountStatus, ...userBasic } = user;
      return userBasic;
    } catch (error) {
      throw new NotFoundException(`No User With ID: ${id}`);
    }
  }

  private validateModifyUserConnectionStatus(status: UserConnectionStatus): boolean {
    if (status in UserConnectionStatus) {
      return true;
    }
    return false;
  }

  private validateModifyUserPassword(body: ModifyProfileRequest, user: UserBasic): boolean | any[] {
    if (body.password == '') {
      return false;
    }
    let currentPassword: boolean = false;
    if (bcrypt.compareSync(body.password, user.password)) {
      currentPassword = true;
    }

    var passwordSchema = new passwordValidator();
    //Properties
    passwordSchema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(100) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .digits(2) // Must have at least 2 digits
      // .is()
      // .not()
      // .oneOf([currentPassword ? body.password : '']); // Blacklist these values

    return passwordSchema.validate(body.password) ? true : passwordSchema.validate(body.password, { details: true });
  }

  private async validateModifyUserEmail(email: string): Promise<boolean> {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        email: email,
      });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
    return true;
  }

  private getUserRoles(user: User): Object {
    let userRoles: Object = {};
    let userRolesArray: Array<Object> = Object.keys(user.userRole)
      .filter((key) => user.userRole[key] === true)
      .map((roles) => {
        let userRoles = {};
        userRoles[roles] = true;
        return userRoles;
      });

    for (let i = 0; i < userRolesArray.length; i++) {
      Object.assign(userRoles, userRolesArray[i]);
    }
    return userRoles;
  }
}
type ValidationStatus = {
  password: boolean | any[];
  connectionStatus: boolean;
  email: boolean;
};
