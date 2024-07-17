import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @MinLength(15)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  avatar?: string;

  @IsBoolean()
  @ApiProperty({ default: false })
  isAdmin: boolean = false;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updateAt: Date;
}
