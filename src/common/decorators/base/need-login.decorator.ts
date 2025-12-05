import { SetMetadata } from '@nestjs/common';

export const NEED_LOGIN_METADATA = 'NEED_LOGIN_METADATA';


// 这是一个标准的 NestJS 装饰器，它将 options 存储在元数据中
export const NeedLogin = () => SetMetadata(NEED_LOGIN_METADATA, true);
