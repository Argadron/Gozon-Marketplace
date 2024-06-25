import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrismaService } from "src/prisma.service";
import { Socket, Server } from 'socket.io'
import config from '../config/constants'
import { SendAlertDto } from "./dto/send-alert.dto";
import { BadRequestException, NotFoundException, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { WebSocketExecption } from "../common/filters/websockets-execeptions.filter";
import { RegisterGateWayDto } from "./dto/register-gateway.dto";

const constants = config()

@WebSocketGateway({ cors: constants.API_CLIENT_URL })
@UseFilters(WebSocketExecption)
export class AlertsGateWay {
    constructor(private readonly prismaService: PrismaService
    ) {}

    @WebSocketServer() private readonly server: Server;

    @SubscribeMessage("register")
    @UsePipes(new ValidationPipe())
    async register(@ConnectedSocket() client: Socket, @MessageBody() payload: RegisterGateWayDto) {
        const User = await this.prismaService.user.findUnique({
            where: {
                username: payload.username
            }
        })

        if (!User) throw new NotFoundException("User not found")

        client.join(`${User.id}`)
        client.emit("getRoomData", {
            room: `${User.id}`
        })
    }

    @SubscribeMessage("sendAlert")
    @UsePipes(new ValidationPipe())
    async alert(@ConnectedSocket() client: Socket, @MessageBody() payload: SendAlertDto) {
       const { id } = await this.prismaService.user.findUnique({
            where: {
                username: payload.username
            }
       })

       if (!id) throw new BadRequestException("User not found")

       this.server.to(`${id}`).emit("alert", payload.description)
    }
}