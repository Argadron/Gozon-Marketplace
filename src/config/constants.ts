import 'dotenv/config'

export default () => ({
    HOST: process.env.HOST ?? "localhost",
    PORT: +process.env.PORT ?? 3000,
    NODE_ENV: process.env.NODE_ENV ?? "development",
    API_CLIENT_URL: process.env.API_CLIENT_URL,
    JWT_SECRET: process.env.JWT_SECRET ?? "secret"
})