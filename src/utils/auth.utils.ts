import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';

export class AuthUtils {
  constructor(private readonly prismaService: PrismaService) {}
  async existingUser(user: User) {
    return await this.prismaService.user.findUnique({
      where: {
        email
      },
    });
  }
}
