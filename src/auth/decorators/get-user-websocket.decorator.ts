import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Socket } from 'socket.io'

export const WebsocketUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const socket: Socket = ctx.switchToWs().getClient()

    let id: number; 

    socket.rooms.forEach(elem => {
        if (!Number.isNaN(parseInt(elem))) id = parseInt(elem)
    })

    return id
})