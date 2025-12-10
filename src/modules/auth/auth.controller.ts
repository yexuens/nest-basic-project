import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NeedLogin } from '@/common/decorators/base/need-login.decorator';
import { ApiResult } from '@/common/decorators/base/api-result.decorator';
import { Token } from '@/common/decorators/base/token.decorator';
import { UserLoginRequest, UserLoginResponse } from '@/modules/auth/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('logout')
  @NeedLogin()
  @ApiResult(String)
  async logout(@Token() token: string) {
    return this.authService.logout(token);
  }

  @Post('sign')
  @ApiResult(UserLoginResponse)
  async sign(@Body() signDto: UserLoginRequest) {
    return await this.authService.sign(signDto);
  }
}
