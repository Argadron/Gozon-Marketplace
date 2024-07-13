import 'dotenv/config'

export default () => ({
    HOST: process.env.HOST ?? "localhost",
    PORT: +process.env.PORT ?? 3000,
    NODE_ENV: process.env.NODE_ENV ?? "development",
    API_CLIENT_URL: process.env.API_CLIENT_URL,
    JWT_SECRET: process.env.JWT_SECRET ?? "secret",
    API_VERSION: process.env.API_VERSION ?? "1.0",
    REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME ?? "refreshToken",
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    TELEGRAM_API_KEY: process.env.TELEGRAM_API_KEY
})