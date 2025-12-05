import { SetMetadata } from '@nestjs/common';

export const BYPASS_KEY = 'BYPASS_TRANSFORM';
export const BypassTransform = () => SetMetadata(BYPASS_KEY, true);