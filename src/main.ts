import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/constants'
import { GlobalLogger } from './common/interceptors/globalLogger.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'

const constants = config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  app.enableCors({
    origin: constants.API_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
  app.useGlobalInterceptors(new GlobalLogger)
  app.use(cookieParser())
  
  const swaggerConfig = new DocumentBuilder()
  .setTitle("The Gozon API")
  .setDescription("Documentation Gozon API")
  .setVersion(constants.API_VERSION)
  .addBearerAuth({
    type: "http",
    bearerFormat: "JWT",
    in: "header",
    scheme: "bearer",
    name: "JWT",
    description: "Enter your access jwt token",
  })
  .addCookieAuth(constants.REFRESH_TOKEN_COOKIE_NAME, {
    type: "apiKey",
    in: "cookie",
    description: "Enter your cookie refresh jwt token",
    name: constants.REFRESH_TOKEN_COOKIE_NAME
  })
  .build()
  
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("/swagger", app, document)

  await app.listen(constants.PORT, constants.HOST);
}
bootstrap();
