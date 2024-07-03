import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Socket } from 'socket.io'

@Injectable()
export class WebsocketJwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const socket: Socket = context.switchToWs().getClient()

        let id: number; 

        socket.rooms.forEach(elem => {
            if (!Number.isNaN(parseInt(elem))) id = parseInt(elem)
        }) 

        if (!id) return false 

        return true
    }
}