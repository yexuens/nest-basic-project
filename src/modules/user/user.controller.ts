import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResult } from '@/common/decorators/api-result.decorator';
import { UserCreateDto, UserDto } from '@/modules/user/schema';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('')
  @ApiResult(UserDto, true)
  async getList() {
    return await this.userService.findAll();

  }

  @Post('')
  @ApiResult(UserDto)
  async create(@Body() createUserDto: UserCreateDto) {
    return await this.userService.create(createUserDto);
  }
}
