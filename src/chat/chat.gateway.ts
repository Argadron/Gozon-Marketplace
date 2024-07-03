import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import config from '../config/constants'
import { ConflictException, ForbiddenException, NotFoundException, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebSocketExecption } from '../common/filters/websockets-execeptions.filter';
import { Server, Socket } from 'socket.io'
import { NewChatDto } from './dto/new-chat.dto';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { WebsocketUser } from '../auth/decorators/get-user-websocket.decorator';
import { WebsocketJwtGuard } from '../auth/guards/websocket-jwt.guard';

const constants = config()

@WebSocketGateway({ cors: constants.API_CLIENT_URL })
@UseFilters(WebSocketExecption)
@UseGuards(WebsocketJwtGuard)
export class ChatGateway {
  constructor(private readonly chatService: ChatService,
              private readonly prismaService: PrismaService,
              private readonly usersService: UsersService
  ) {}

  @WebSocketServer() private readonly server: Server

  @SubscribeMessage("newChat") 
  @UsePipes(new ValidationPipe())
  async newChat(@ConnectedSocket() client: Socket, @MessageBody() payload: NewChatDto, @WebsocketUser() userId: number) {
    const { id, username } = await this.usersService.findBy({ id: userId })

    if (!id) throw new NotFoundException("Socket author not found")

    const User = await this.usersService.findBy({ username: payload.username })

    if (!User) throw new NotFoundException("User not found")

    if (User.blackList.includes(id)) throw new ForbiddenException("You are in blacklist this user")

    if (await this.chatService.findChat(User.id, id)) throw new ConflictException("You already has chat with this seller!")
    
    await this.prismaService.chat.create({
      data: {
        sellerId: User.id, 
        userId
      }
    })

    client.emit("newChat", { username: User.username })
    this.server.to(`${User.id}`).emit("newChat", { username })
  }
}
