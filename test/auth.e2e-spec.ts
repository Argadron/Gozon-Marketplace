import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from '../src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../src/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from  '../src/file.service'
import * as request from 'supertest';

describe("AuthController (E2E)", () => {
    let app: INestApplication;
    const testNewUser = {
        username: "Васек",
        password: "123123123",
        email: "test2424242@mail.ru",
        phone: "+78005121001"
      }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, JwtModule.register({
                secret: "secret"
            }), ConfigModule.forRoot()],
            providers: [PrismaService, ConfigService, FileService]
        }).compile()

        app = moduleFixture.createNestApplication()

        app.setGlobalPrefix("/api")

        await app.init()
    })

    it("/api/auth/register (POST) (Проверка регистрации юзера)", async () => {
        return request(app.getHttpServer())
        .post("/api/auth/register")
        .send(testNewUser)
        .expect(201)
    })

    it("/api/auth/login (POST) (Проверка логина юзера)", async () => {
        return request(app.getHttpServer())
        .post("/api/auth/login")
        .send(testNewUser)
        .expect(200)
    })
})