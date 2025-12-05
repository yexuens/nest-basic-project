import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from '@/common/dtos/result';
import { Reflector } from '@nestjs/core';
import { BYPASS_KEY } from '@/common/decorators/bypass-transform.decorator';


@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Result<T>> {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Result<T>> {

    const bypass = this.reflector.get<boolean>(
      BYPASS_KEY,
      context.getHandler(),
    );

    if (bypass) {
      return next.handle(); // 直接放行，不包装
    }

    return next.handle().pipe(
      map((data) => {
        return Result.success(data);
      }),
    );
  }
}