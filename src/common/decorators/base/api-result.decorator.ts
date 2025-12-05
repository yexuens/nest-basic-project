import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ArrayDataResponse, DataResponse } from '@/common/utils/response.util';

export const ApiResult = <T extends Type<any>>(model: T, isArray: boolean = false) => {
  // 动态选择使用 单个包装 还是 数组包装
  const responseClass = isArray ? ArrayDataResponse(model) : DataResponse(model);

  return applyDecorators(
    ApiOkResponse({
      type: responseClass,
    })
  );
};