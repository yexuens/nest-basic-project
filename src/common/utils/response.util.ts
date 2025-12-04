// common/utils/response.util.ts
import { ApiProperty } from '@nestjs/swagger';
import { Result } from '@/common/dtos/result';

type Constructor<T = any> = new (...args: any[]) => T;

export function ArrayDataResponse<T extends Constructor>(Dto: T) {
  class ArrayResponseClass extends Result {
    @ApiProperty({
      description: '响应数据列表',
      type: [Dto],
    })
    // ✅ 修复点：添加 declare 关键字
    declare data: InstanceType<T>[];
  }

  Object.defineProperty(ArrayResponseClass, 'name', { value: `${Dto.name}ListResponse` });

  return ArrayResponseClass;
}

export function DataResponse<T extends Constructor>(Dto: T) {
  class DataResponseClass extends Result {
    @ApiProperty({
      description: '响应数据',
      type: Dto,
    })
    // ✅ 修复点：添加 declare 关键字
    declare data: InstanceType<T>;
  }

  Object.defineProperty(DataResponseClass, 'name', { value: `${Dto.name}Response` });

  return DataResponseClass;
}