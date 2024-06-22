import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()

    return data ? request.user[`${data}`] : request.user
})