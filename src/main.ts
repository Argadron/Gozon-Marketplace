import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/constants'
import { GlobalLogger } from './common/interceptors/globalLogger.interceptor';

const constants = config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  app.enableCors({
    origin: constants.API_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
  app.useGlobalInterceptors(new GlobalLogger)

  await app.listen(constants.PORT, constants.HOST);
}
bootstrap();
