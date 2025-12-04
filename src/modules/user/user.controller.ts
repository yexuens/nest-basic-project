import { Controller, Get } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Result } from '@/common/dtos/result';
import { ApiResult } from '@/common/decorators/api-result.decorator';

class UserDTO {
  @ApiProperty({ description: '用户ID' })
  id: number;
  @ApiProperty({ description: '用户名' })
  name: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('')
  @ApiResult(UserDTO, true)
  async getList() {
    return Result.success(
      [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
      ],
    );
  }
}
