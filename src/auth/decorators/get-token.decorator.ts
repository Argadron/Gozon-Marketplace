import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { ExtractJwt } from "passport-jwt";

export const Token = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()

    return ExtractJwt.fromAuthHeaderAsBearerToken()(request)
})