import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetResult = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const result = req.resut;
  if (!result)
    throw new InternalServerErrorException('Result not found (request)');
  return !data ? result : result[data];
});
