import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import prismaTestClient from '../prisma-client.forTest'
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { AlertsService } from '../alerts/alerts.service';
import { ConfigService } from '@nestjs/config'
import { FileService } from '../file.service';
import { JwtService } from '@nestjs/jwt';

const prisma = prismaTestClient()

describe('ChatService', () => {
  let service: ChatService;
  const testCreateChat = {
    sellerId: 64,
    userId: 32
  }
  let chatId: number;
  let messageId: number;

  beforeAll(async () => {
    const chat = await prisma.chat.create({ data: { sellerId: 55, userId: 3 } })

    chatId = chat.id 

    const message = await prisma.message.create({ data: { text: "тесттест", userId: 3, chatId } })

    messageId = message.id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway, ChatService, PrismaService, UsersService, AlertsService, FileService, ConfigService, JwtService],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('Проверка создания чата', async () => {
    expect((await service.createChat(testCreateChat.sellerId, testCreateChat.userId)).id).toBeDefined();
  });

  it("Проверка отправки сообщения", async () => {
    expect((await service.sendMessage("привет", 3, chatId)).text).toBeDefined()
  })

  it("Проверка изменения сообщения", async () => {
    expect((await service.editMessage("не привет", messageId)).id).toBeDefined()
  })

  it("Проверка удаления сообщения", async () => {
    expect((await service.deleteMessage(messageId)).id).toBeDefined()
  })

  it("Проверка удаления чата", async () => {
    expect((await service.deleteChat(chatId)))
  })

  afterAll(async () => {
    await prisma.message.deleteMany({
      where: {
        text: "привет"
      }
    })
  })
});
