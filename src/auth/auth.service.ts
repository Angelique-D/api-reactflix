import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {}

    async signIn(signinDto: SigninDto): Promise<any> {
        const { email, password } = signinDto;
        const user = await this.usersService.get(id { where: email });
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user 
    }
}