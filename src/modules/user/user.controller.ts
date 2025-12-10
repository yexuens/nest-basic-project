import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResult } from '@/common/decorators/base/api-result.decorator';
import { UserCreateDto, UserDto } from '@/modules/user/user.schema';
import { UserId } from '@/common/decorators/base/user.decorator';
import { NeedLogin } from '@/common/decorators/base/need-login.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get('profile')
  @NeedLogin()
  @ApiResult(UserDto)
  async profile(@UserId() userId: number) {
    return this.userService.getById(userId);
  }
}
