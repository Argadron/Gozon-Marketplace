import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/constants'

const constants = config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  app.enableCors({
    origin: constants.API_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })

  await app.listen(constants.PORT, constants.HOST);
}
bootstrap();
