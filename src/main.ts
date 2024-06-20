import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/constants'

const contants = config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")

  await app.listen(contants.PORT, contants.HOST);
}
bootstrap();
