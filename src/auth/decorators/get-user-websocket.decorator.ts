import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Socket } from 'socket.io'

export const WebsocketUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const socket: Socket = ctx.switchToWs().getClient()

    return socket["user"]
})