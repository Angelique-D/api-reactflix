import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async getUsers() {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    return users;
  }
}
