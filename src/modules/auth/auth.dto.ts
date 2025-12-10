import { ApiProperty } from '@nestjs/swagger';

export class UserLoginRequest {
  @ApiProperty()
  email: string;
}

export class UserLoginResponse {
  id: number;
  token: string;
  name: string;
  email: string;
}
