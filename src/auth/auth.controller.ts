import { Body, Controller, Post } from '@nestjs/common';
import { AccessDTO, loginDTO } from './dto';
import { ViewUUserDTO } from 'src/user';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: loginDTO): Promise<ViewUUserDTO | null> {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: loginDTO): Promise<AccessDTO> {
    return this.authService.login(data);
  }
}
