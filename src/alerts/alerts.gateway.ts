import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrismaService } from "../prisma.service";
import { Socket, Server } from 'socket.io'
import config from '../config/constants'
import { SendAlertDto } from "./dto/send-alert.dto";
import { BadRequestException, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { WebSocketExecption } from "../common/filters/websockets-execeptions.filter";
import { WebSocketJwtGuard } from "../common/guards/WebsocketJwt.guard";
import { AdminGuard } from "../auth/guards/admin.guard";

const constants = config()

@WebSocketGateway({ cors: constants.API_CLIENT_URL })
@UseFilters(WebSocketExecption)
@UseGuards(WebSocketJwtGuard)
export class AlertsGateWay {
    constructor(private readonly prismaService: PrismaService
    ) {}

    @WebSocketServer() private readonly server: Server;

    @SubscribeMessage("sendAlert")
    @UsePipes(new ValidationPipe())
    @UseGuards(AdminGuard)
    async alert(@ConnectedSocket() client: Socket, @MessageBody() payload: SendAlertDto) {
       if (payload.isGlobal) return this.server.emit("alert", payload.description)

       const User = await this.prismaService.user.findUnique({
            where: {
                username: payload.username
            }
       })

       if (!User) throw new BadRequestException("User not found")

       this.server.to(`local:${User.id}`).emit("alert", payload.description)
    }
}