import 'dotenv/config'

export default () => ({
    HOST: process.env.HOST ?? "localhost",
    PORT: +process.env.PORT ?? 3000
})