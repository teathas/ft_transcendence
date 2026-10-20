import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentApiUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string =>
    context.switchToHttp().getRequest().apiKey.userId,
);
