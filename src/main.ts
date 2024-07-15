import { NestFactory } from '@nestjs/core';
import { GlobalLogger } from '@interceptors/globalLogger.interceptor';
import { InternalExceptionsFilter } from '@filters/internal-exceptions.filter';
import { SwaggerModuleLocal } from '@swagger/swagger.module';
import config from '@config/constants'
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'

const constants = config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  app.enableCors({
    origin: constants.API_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: "Set-Cookie"
  })
  app.useGlobalInterceptors(new GlobalLogger)
  app.useGlobalFilters(new InternalExceptionsFilter)
  app.use(cookieParser())

  SwaggerModuleLocal.forRoot(app)

  await app.listen(constants.PORT, constants.HOST);
}
bootstrap();
