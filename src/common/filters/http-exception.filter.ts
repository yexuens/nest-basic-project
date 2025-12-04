import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { Result } from '@/common/dtos/result';
import { ZodError } from 'zod';
import { FastifyReply } from 'fastify';

@Catch(ZodValidationException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as FastifyReply;

    const zodError = exception.getZodError() as ZodError;

    const firstError = zodError.issues[0];
    const message = firstError
      ? `${firstError.path.join('.')}: ${firstError.message}`
      : '请求参数校验失败';

    response
      .status(HttpStatus.OK)
      .send(Result.fail(message, 400));

  }
}