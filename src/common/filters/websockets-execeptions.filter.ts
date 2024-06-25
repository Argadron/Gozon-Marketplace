import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { Socket } from 'socket.io'

@Catch(HttpException)
export class WebSocketExecption {
    catch(execption: HttpException, host: ArgumentsHost) {
        const client: Socket = host.switchToWs().getClient()

        client.emit("error", execption)
    }
}