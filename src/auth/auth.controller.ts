import { Body, Controller, Post } from '@nestjs/common';
import { AccessDTO, loginDTO } from './dto';
import { ViewUUserDTO } from 'src/user';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register' })
  @Post('register')
  register(@Body() data: loginDTO): Promise<ViewUUserDTO | null> {
    return this.authService.register(data);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Login' })
  @Post('login')
  login(@Body() data: loginDTO): Promise<AccessDTO> {
    return this.authService.login(data);
  }
}
