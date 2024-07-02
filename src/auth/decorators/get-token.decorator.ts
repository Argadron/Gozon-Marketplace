import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import config from '../../config/constants'

const constants = config()

export const Token = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()

    return request.cookies ? request.cookies[constants.REFRESH_TOKEN_COOKIE_NAME] : null
})