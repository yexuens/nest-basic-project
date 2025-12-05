import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Result } from '@/common/dtos/result';

// @Catch() 不带参数，表示捕获所有异常
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    // 1. 初始化默认状态码和消息 (默认为 500 系统错误)
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    // 2. 处理 NestJS 标准的 HttpException (如 404 NotFound, 403 Forbidden 等)
    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // HttpException 的 response 可能是字符串，也可能是对象 { message: string | string[], ... }
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // 尝试提取 message 字段
        const msg = (exceptionResponse as any).message;
        // 假如 message 是数组（Nest 默认验证管道的错误格式），将其拼接
        message = Array.isArray(msg) ? msg.join('; ') : msg || message;
      }
    } else {
      // 3. 处理系统未知异常 (非 HttpException)
      // 只有这种未知错误才需要打印 Error 日志，避免 404 等常规错误刷屏
      this.logger.error(`请求路径: ${request.url}`, exception);

      // 如果你是开发环境，可能希望把具体的错误堆栈返回给前端调试
      // message = (exception as Error).message;
    }

    // 4. 发送响应
    // 遵循你的风格：HTTP status 始终 200，业务状态码放在 Result.fail(msg, code) 中
    response
      .status(HttpStatus.OK)
      .send(Result.fail(message, code));
  }
}