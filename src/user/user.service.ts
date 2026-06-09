import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { ViewUUserDTO } from './dto';
import { UserViewMapper } from './mappers';
import { User } from 'generated/prisma/client';

@Injectable()
export class UserService {
  private readonly mapper = new UserViewMapper();

  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { email } });

    if (!data) {
      return null;
    }

    return data;
  }

  async createUser(
    email: string,
    hashedPassword: string,
  ): Promise<ViewUUserDTO> {
    const data = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
    return this.mapper.mapOne(data);
  }
}
