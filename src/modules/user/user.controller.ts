import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResult } from '@/common/decorators/base/api-result.decorator';
import { UserCreateDto, UserDto, UserLoginRequest, UserLoginResponse } from '@/modules/user/user.schema';
import { UserId } from '@/common/decorators/base/user.decorator';
import { NeedLogin } from '@/common/decorators/base/need-login.decorator';
import { Token } from '@/common/decorators/base/token.decorator';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('')
  @ApiResult(UserDto, true)
  async getList() {
    return this.userService.findAll();

  }

  @Post('')
  @ApiResult(UserDto)
  async create(@Body() createUserDto: UserCreateDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('sign')
  @ApiResult(UserLoginResponse)
  async sign(@Body() signDto: UserLoginRequest) {
    return await this.userService.sign(signDto);
  }

  @Get('profile')
  @NeedLogin()
  @ApiResult(UserDto)
  async profile(@UserId() userId: number) {
    return this.userService.getById(userId);
  }

  @Post('logout')
  @NeedLogin()
  @ApiResult(String)
  async logout(@Token() token: string) {
    return this.userService.logout(token);
  }

}
