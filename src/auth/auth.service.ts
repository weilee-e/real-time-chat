import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessDTO, loginDTO } from './dto';
import { UserService, ViewUUserDTO } from 'src/user';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: loginDTO): Promise<ViewUUserDTO | null> {
    const email = await this.userService.findByEmail(data.email);
    if (email) {
      throw new BadRequestException('User already exists');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const profile = await this.userService.createUser(
      data.email,
      hashedPassword,
    );

    return profile;
  }

  async login(data: loginDTO): Promise<AccessDTO> {
    const profile = await this.userService.findByEmail(data.email);
    if (!profile) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const match = await bcrypt.compare(data.password, profile.password);

    if (!match) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const token = this.jwtService.sign({
      sub: profile.userId,
      email: profile.email,
    });

    return {
      access_token: token,
    };
  }
}
