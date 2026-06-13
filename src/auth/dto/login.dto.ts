import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class loginDTO {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email!: string;
  @ApiProperty({ example: 'Pa$$w0rD' })
  password!: string;
}
