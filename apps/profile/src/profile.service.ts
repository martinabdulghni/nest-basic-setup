import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ModifyProfileRequest } from 'apps/auth/src/users/dto/create-user.request';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { User, UserBasic } from 'apps/auth/src/users/schemas/user.schema';
import * as passwordValidator from 'password-validator';
import * as emailValidator from 'email-validator';
import { UserConnectionStatus, UserModifiedStatusType } from 'libs/types/user-status';
import { Response } from 'express';
import { OrdersRepository } from 'apps/orders/src/orders.repository';

type ValidationStatus = {
  password: boolean | any[];
  connectionStatus: boolean;
  email: boolean;
};

@Injectable()
export class ProfileService {
  constructor(private readonly usersRepository: UsersRepository, private readonly orderRepository: OrdersRepository) {}

  private user: UserBasic;

  /**
   ** Gets current user profile after authentication.
   *
   * ---------------------------------
   *? @api-request {GET}
   *  @requires {Authentication Token}
   *  @access User
   *  @readonly
   *  @async
   *  @param {User} user
   *  @returns {Promise<UserBasic>}
   */
  async getProfile(user: User): Promise<UserBasic> {
    this.user = user;

    // Get user roles:
    if (!(this.user.userRole.Admin || this.user.userRole.SuperAdmin || this.user.userRole.SuperDeveloper || this.user.userRole.Super)) {
      this.user.userRole = this.getUserRoles(this.user);
    }
    if (!(this.user.userRole.Admin || this.user.userRole.SuperAdmin || this.user.userRole.SuperDeveloper || this.user.userRole.Super)) {
      this.user.userAccountStatus = this.getUserAccountStatus(this.user);
    }

    const { history, lastLoggedIn, ...userBasic } = user;
    this.user = userBasic;
    this.user.userOrders = await this.getUserOrders(user);

    return this.user;
  }

  /**
   ** Modifies current user profile after authentication.
   *
   * ---------------------------------
   *? @api-request {PUT}
   *  @requires {Authentication Token}
   *  @access User
   *  @readonly
   *  @async
   *  @param {Response} response
   *  @param {User} user
   *  @param {ModifyProfileRequest} body
   *  @returns {Promise<UserBasic>}
   */
  async modifyProfile(response: Response, user: User, body: ModifyProfileRequest): Promise<UserBasic> {
    this.user = user;
    // else: throw new badRequest
    if (body !== undefined) {
      let { _id, addedDate, history, lastLoggedIn, userOrders, userRole, userAccountStatus, ...bodyUser } = user;
      if (bodyUser === body) {
        throw new BadRequestException('Nothing to modify.');
      }
      const isEmail = emailValidator.validate(body.email);
      // else: throw new badRequest

      if (isEmail) {
        // UserBasic: Only spcific data to see

        if (Object.keys(body).length === 1 && Object.keys(body)[0] === 'email' && user.email === body.email) {
          throw new BadRequestException('Nothing To Modify');
        }

        // [OK] Validation
        let validationStatus: ValidationStatus = await this.validateBodyDataToModifyUser(body, user);

        if (Object.values(validationStatus).every(Boolean) && Object.values(validationStatus).every((key) => key === true)) {
          await this.modifyValidUser(user, body);
          if (!(this.user.userRole.Admin || this.user.userRole.SuperAdmin || this.user.userRole.SuperDeveloper || this.user.userRole.Super)) {
            this.user.userRole = this.getUserRoles(this.user);
          }
          if (!(this.user.userRole.Admin || this.user.userRole.SuperAdmin || this.user.userRole.SuperDeveloper || this.user.userRole.Super)) {
            this.user.userRole = this.getUserAccountStatus(this.user);
          }
          const { history, lastLoggedIn, ...userBasic } = user;
          this.user = userBasic;
          if (body.email !== undefined || body.password !== undefined) {
            response.clearCookie('Authentication');
          }
          return this.user;
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
            userAccountStatus: {
              isModified: true,
            },
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
    if (body.password !== '' && body.password !== undefined) {
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
      .digits(2); // Must have at least 2 digits
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

  private getUserRoles(user: UserBasic): Object {
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
  private getUserAccountStatus(user: UserBasic): Object {
    let userAccountStatus: Object = {};
    let userAccountStatusArray: Array<Object> = Object.keys(user.userAccountStatus)
      .filter((key) => user.userRole[key] === true)
      .map((roles) => {
        let userAccountStatus = {};
        userAccountStatus[roles] = true;
        return userAccountStatus;
      });

    for (let i = 0; i < userAccountStatusArray.length; i++) {
      Object.assign(userAccountStatus, userAccountStatusArray[i]);
    }
    return userAccountStatus;
  }

  async getUserOrders(user: User): Promise<any[]> {
    try {
      const orders = await this.orderRepository.find({
        userId: user._id.toString(),
      });
      if (orders.length > 0) {
        if (user._id.toString() === orders[0].userId) {
          const ordersBasic = orders.map((o) => {
            return {
              items: o.items,
              date: o.date,
            };
          });
          return ordersBasic;
        }
        throw new ForbiddenException();
      }
      return [];
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
