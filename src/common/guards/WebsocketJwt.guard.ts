import { ExecutionContext, Injectable, UnauthorizedException, UseFilters } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Socket } from 'socket.io'
import { WebSocketExecption } from "@filters/websockets-execeptions.filter";
import { JwtUser } from "../../auth/interfaces";

@Injectable()
@UseFilters(WebSocketExecption)
export class WebSocketJwtGuard {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean | Observable<boolean>> {
        const socket: Socket = context.switchToWs().getClient()

        const token = socket.handshake.auth?.token

        if (!token) throw new UnauthorizedException("No access token!")

        const user = await this.validate(token)

        socket["user"] = user 
        await socket.join(`local:${user.id}`)

        return true
    }

    async validate(token: string): Promise<JwtUser> {
        try {
            return await this.jwtService.verifyAsync(token)
        } catch(e) {
            throw new UnauthorizedException("Token Invalid")
        }
    }
}