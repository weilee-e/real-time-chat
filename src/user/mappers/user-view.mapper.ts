import { User } from 'generated/prisma/client';
import { ViewUUserDTO } from '../dto';

export class UserViewMapper {
  mapOne(data: User): ViewUUserDTO {
    return {
      id: data.userId,
      email: data.email,
      password: data.password,
    };
  }
}
