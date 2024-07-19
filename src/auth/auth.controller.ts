// eslint-disable-next-line prettier/prettier
import { Body, Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('reset-password')
  resetPasswordDemand(@Body() resetPasswordDemandDto: ResetPasswordDemandDto) {
    return this.authService.resetPasswordDemand(resetPasswordDemandDto);
  }

  @Post('reset-password-confirmation')
  resetPasswordConfirmation(
    @Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    return this.authService.resetPasswordConfirmation(
      resetPasswordConfirmationDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('updateAccount')
  @ApiOkResponse({ type: User })
  async update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const userId = user.id;
    return this.authService.updateAccount(userId, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  @ApiOkResponse({ type: User })
  async deleteAccount(
    @GetUser() user: User,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    const userId = user.id;
    return await this.authService.deleteAccount(userId, deleteAccountDto);
  }
}
