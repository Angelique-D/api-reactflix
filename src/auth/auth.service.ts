// eslint-disable-next-line prettier/prettier
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
// eslint-disable-next-line prettier/prettier
import { DeleteAccountDto, ResetPasswordConfirmationDto, ResetPasswordDemandDto } from './dto/*';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  updateAccount(userId: string, updateUserDto: UpdateUserDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly JwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signup(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    // Vérifier si l'utilisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({ where: { email } });
    // throw new Error('Method not implemented.');
    if (user) throw new ConflictException('User already exists');

    // Hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Enregistrer l'utilisateur dans la base de données
    await this.prismaService.user.create({
      data: { email, password: hash, name },
    });

    // Envoyer un email de confirmation
    await this.mailerService.sendSignupConfirmation(email);
    // Retourner une réponse de succès
    return { data: 'User successfully created' };
  }

  async signin(signinDto: SigninDto) {
    // throw new Error('Method not implemented');
    const { email, password } = signinDto;
    // Vérifier si l'utilisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    // Comparer le mot de passe
    const isTheSamePassword = await bcrypt.compare(password, user.password);
    if (!isTheSamePassword)
      throw new UnauthorizedException('Invalid Credentials');

    // Retourner un token jwt
    const payload = {
      sub: user.userId,
      email: user.email,
    };
    const token = this.JwtService.sign(payload);

    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
    // throw new Error('Method not implemented.');

    const { email } = resetPasswordDemandDto;
    // Vérifier si l'utilisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const code = speakeasy.totp({
      secret: this.configService.get('OTP_CODE'),
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    // A changer avec l'url qui mène au formulaire pour le changement de mot de pass du front
    const url = 'http://localhost:3000/auth/reset-password-confirmation';
    await this.mailerService.sendResetPassword(email, url, code);
    return { data: 'Reset password mail has been sent' };
  }

  async resetPasswordConfirmation(
    resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    // throw new Error('Method not implemented.');
    const { code, email, password } = resetPasswordConfirmationDto;

    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const isTheSameCode = speakeasy.totp.verify({
      secret: this.configService.get('OTP_CODE'),
      token: code,
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    if (!isTheSameCode)
      throw new UnauthorizedException('Invalid/expired token');

    const hash = await bcrypt.hash(password, 10);

    await this.prismaService.user.update({
      where: { email },
      data: { password: hash },
    });
    return { data: 'Password updated' };
  }

  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
    const { password } = deleteAccountDto;

    //Vérifier l'existance de l'utilisateur
    const user = await this.prismaService.user.findUnique({
      where: { userId },
    });
    if (!user) throw new NotFoundException('User not found');

    // Comparer le mot de passe
    const isTheSamePassword = await bcrypt.compare(password, user.password);
    if (!isTheSamePassword)
      throw new UnauthorizedException('Invalid Credentials');

    await this.prismaService.user.delete({ where: { userId } });
    return { data: 'User successfully deleted' };
  }
}
