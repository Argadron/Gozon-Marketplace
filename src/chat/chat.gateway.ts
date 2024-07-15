import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import config from '@config/constants'
import { WebSocketExecption } from '@filters/websockets-execeptions.filter';
import { WebsocketUser } from '@decorators/get-user-websocket.decorator';
import { WebSocketJwtGuard } from '../common/guards/WebsocketJwt.guard';
import { NewMessageDto } from './dto/new-message.dto';
import { ChatConnectDto } from './dto/chat-connect.dto';
import { ChatDisconnectDto } from './dto/chat-disconnect.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { DeleteChatDto } from './dto/delete-chat.dto';
import { NewChatDto } from './dto/new-chat.dto';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { JwtUser } from '../auth/interfaces';
import { Server, Socket } from 'socket.io'

const constants = config()

@WebSocketGateway({ cors: constants.API_CLIENT_URL })
@UseFilters(WebSocketExecption)
@UseGuards(WebSocketJwtGuard)
export class ChatGateway {
  constructor(private readonly chatService: ChatService,
              private readonly usersService: UsersService
  ) {}

  @WebSocketServer() private readonly server: Server

  @SubscribeMessage("newChat") 
  @UsePipes(new ValidationPipe())
  async newChat(@ConnectedSocket() client: Socket, @MessageBody() payload: NewChatDto, @WebsocketUser() user: JwtUser) {
    const { id, username } = await this.usersService.findBy({ id: user.id })

    if (!id) throw new NotFoundException("Socket author not found")

    const User = await this.usersService.findBy({ username: payload.username })

    if (!User) throw new NotFoundException("User not found")

    if (User.blackList.includes(id)) throw new ForbiddenException("You are in blacklist this user")

    if (await this.chatService.findChat(User.id, id)) throw new ConflictException("You already has chat with this seller!")
    
    await this.chatService.createChat(User.id, user.id)

    client.emit("newChat", { username: User.username })
    this.server.to(`local:${User.id}`).emit("newChat", { username })
  }

  @SubscribeMessage("joinChat")
  @UsePipes(new ValidationPipe())
  async joinChat(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatConnectDto, @WebsocketUser() user: JwtUser) {
    const User = await this.usersService.findBy({ username: payload.username })

    if (!User) throw new NotFoundException("User not found")

    const chat = await this.chatService.findChat(User.id, user.id)

    if (!chat) throw new NotFoundException("Chat not found")

    if (client.rooms.has(`chat:${chat.id}`)) throw new ConflictException("Already connect to this chat")

    await client.join(`chat:${chat.id}`)
    this.server.to(`chat:${chat.id}`).emit("joinChat", { messages: chat.messages, username: User.username, chatId: chat.id })
  }

  @SubscribeMessage("chatMessage")
  @UsePipes(new ValidationPipe())
  async newChatMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: NewMessageDto, @WebsocketUser() user: JwtUser) {
    if (!await this.chatService.findChat(-1, user.id)) throw new NotFoundException("Chat not found")

    const { id } = await this.chatService.sendMessage(payload.message, user.id, payload.room)

    this.server.to(`chat:${payload.room}`).emit("chatMessage", { userId: user.id, message: payload.message, messageId: id })
  }

  @SubscribeMessage("leaveChat")
  @UsePipes(new ValidationPipe())
  async leaveChat(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatDisconnectDto) {
    if (!client.rooms.has(`chat:${payload.room}`)) throw new BadRequestException("User not connect to this chat!")

    client.rooms.delete(`chat:${payload.room}`)

    this.server.to(`chat:${payload.room}`).emit("chatDisconnect", { room: payload.room })
  }

  @SubscribeMessage("chatEditMessage")
  @UsePipes(new ValidationPipe())
  async editMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: EditMessageDto, @WebsocketUser() user: JwtUser) {
    const Chat = await this.chatService.findChat(-1, user.id)

    if (!Chat) throw new NotFoundException("Chat not found!")

    const oldMessage = await this.chatService.findMessage(payload.messageId)

    if (!oldMessage) throw new NotFoundException("Message not found")

    if (oldMessage.userId !== user.id) throw new ForbiddenException("This is not your message!")

    const message = await this.chatService.editMessage(payload.message, payload.messageId)

    this.server.to(`chat:${Chat.id}`).emit("messageEdited", { messageId: message.id, userId: message.userId, text: message.text })
  }

  @SubscribeMessage("deleteMessage")
  @UsePipes(new ValidationPipe())
  async deleteMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: DeleteMessageDto, @WebsocketUser() user: JwtUser) {
    const message = await this.chatService.findMessage(payload.messageId)
    
    if (!message) throw new NotFoundException("Message not found")

    if (message.userId !== user.id) throw new ForbiddenException("This is not your message!")
      
    const deleted = await this.chatService.deleteMessage(payload.messageId)

    this.server.to(`chat:${payload.room}`).emit("messageDeleted", { userId: user.id, messageId: deleted.id, text: deleted.text })
  }

  @SubscribeMessage("deleteChat")
  @UsePipes(new ValidationPipe())
  async deleteChat(@ConnectedSocket() client: Socket, @MessageBody() payload: DeleteChatDto, @WebsocketUser() user: JwtUser) {
    const Chat = await this.chatService.findChat(user.id, user.id)

    if (!Chat) throw new NotFoundException("Chat not found")

    if (payload.chatId !== Chat.id) throw new ForbiddenException("You cannot delete this chat!")

    await this.chatService.deleteChat(Chat.id)

    this.server.to(`chat:${Chat.id}`).emit("deleteChat", { deletorId: user.id, chatId: Chat.id })
  }
}
