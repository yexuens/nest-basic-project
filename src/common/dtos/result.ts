// common/result.ts
import { ApiProperty } from '@nestjs/swagger';

export class Result<T = any> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '消息提示', example: 'success' })
  message: string;

  // 注意：这里的 data 为了在 Swagger 中配合 Mixin 动态生成，
  // 我们不加 @ApiProperty，或者加一个宽泛的定义。
  // 实际文档生成会由 Mixin 覆盖。
  data?: T;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * 成功响应
   * @param data 数据载体
   * @param message 提示信息 (默认 'success')
   */
  static success<T>(data?: T, message = 'success'): Result<T> {
    return new Result(200, message, data);
  }

  /**
   * 失败响应
   * @param message 错误信息
   * @param code 错误码 (默认 500)
   */
  static fail(message: string = 'fail', code: number = 500): Result<null> {
    return new Result(code, message, null);
  }

  /**
   * 自定义响应
   */
  static custom<T>(code: number, message: string, data?: T): Result<T> {
    return new Result(code, message, data);
  }
}