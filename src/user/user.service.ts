import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
  getAll() {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  get(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
