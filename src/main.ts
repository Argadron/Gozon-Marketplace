import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/constants'
import { GlobalLogger } from './common/interceptors/globalLogger.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const constants = config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  app.enableCors({
    origin: constants.API_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
  app.useGlobalInterceptors(new GlobalLogger)
  
  const swaggerConfig = new DocumentBuilder()
  .setTitle("The Gozon API")
  .setDescription("Documentation Gozon API")
  .setVersion(constants.API_VERSION)
  .build()
  
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("/swagger", app, document)

  await app.listen(constants.PORT, constants.HOST);
}
bootstrap();
