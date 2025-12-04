import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Result } from '@/common/dtos/result';
import { ApiResult } from '@/common/decorators/api-result.decorator';
import { UserCreateDto, UserDto } from '@/modules/user/schema';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('')
  @ApiResult(UserDto, true)
  async getList() {
    return Result.success(
      await this.userService.findAll(),
    );
  }

  @Post('')
  @ApiResult(UserDto)
  async create(@Body() createUserDto: UserCreateDto) {
    return Result.success(
      await this.userService.create(createUserDto),
    );
  }
}
