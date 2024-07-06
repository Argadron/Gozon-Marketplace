import { ExecutionContext, Logger } from "@nestjs/common";
import { Response } from 'express'

class LoggerHelper {
    before(ctx: ExecutionContext, debugMode: boolean) {
        const time = new Date() 
        const hours = time.getUTCHours() + 5 
        let mins: any = time.getUTCMinutes() 

        if (mins < 10) {
            mins = `0${mins}`
        }
      
        const request: Request = ctx.switchToHttp().getRequest()

        const type = request.method
        const url = request.url
        const body = JSON.stringify(request.body) || null 
      
        const log = `[${hours}:${mins}] [${type}] [${url}] request Body: ${debugMode ? body : body.length > 2 ? true: false}\n` 
      
        Logger.log(log)
    }

    after(ctx: ExecutionContext, data: unknown) {
        const response: Response = ctx.switchToHttp().getResponse()

        const time = new Date() 
        const hours = time.getUTCHours() + 5 
        let mins: any = time.getUTCMinutes() 

        if (mins < 10) {
            mins = `0${mins}`
        }

        const status = response.statusCode
        
        typeof(data) === "object" ? data = JSON.stringify(data) : null
        
        const log = `[${status}] [${hours}:${mins}] response body: ${data}`

        Logger.debug(log)

        if (status >= 500) {
            const handler = ctx.getHandler() 
            const controller = ctx.getClass()
            
            const error = `[${status}] [${hours}:${mins}] in ${controller} in method ${handler} response body: ${data}`

            Logger.error(error)
        }
    }
}

export default new LoggerHelper()