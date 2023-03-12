import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProjectType } from 'libs/types/project';

export class ProjectObject {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  address2: string;

  @IsString()
  @IsNotEmpty()
  postNum: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNum: string;

  @IsString()
  @IsNotEmpty()
  momsRegNum: string;

  @IsString()
  @IsNotEmpty()
  type: ProjectType;
}

export class CreateProjectObject {
  name: string;
  address: string;
  address2: string;
  postNum: string;
  city: string;
  email: string;
  phoneNum: string;
  momsRegNum: string;
  type: ProjectType;
  date: Date;
  createdBy: string;
}
