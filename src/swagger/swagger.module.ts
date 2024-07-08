import { DynamicModule, INestApplication, Module} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import config from '@config/constants'

const constants = config()

@Module({

})
export class SwaggerModuleLocal {
    static forRoot(app: INestApplication): DynamicModule {
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

        return {
            module: SwaggerModuleLocal
        }
    }
}