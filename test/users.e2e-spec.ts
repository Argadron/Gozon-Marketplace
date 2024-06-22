import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersModule } from '../src/users/users.module';
import { Request, Response } from 'express';
import * as request from 'supertest';

describe("UsersController (E2E)", () => {
    let app: INestApplication;

    function setAuthorizationRefresh(req: Request, res: Response, next: Function) {
        req.headers.authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzE5MDQyMDgyLCJleHAiOjE3MjE2MzQwODJ9.9CscTdrQLqZswjoDzvoFD2oxASELaluIteOoT7TaKLU"

        next()
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        app.setGlobalPrefix("/api")
        app.use(setAuthorizationRefresh)

        await app.init()
    })

    it("Проверка получения профиля пользователя", async () => {
        return request(app.getHttpServer())
        .get("/api/users/getProfile")
        .expect(200)
    })

    it("Проверка получения фото профиля пользователя", async () => {
        return request(app.getHttpServer())
        .get("/api/users/getProfilePhoto")
        .expect(200)
    })
})