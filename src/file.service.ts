import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from 'fs'
import * as path from 'path'
import { Response } from "express";
import { v4 } from 'uuid'

@Injectable()
export class FileService {
    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
        if (!fs.existsSync(path.join(process.cwd(), `uploads`, `default.png`))) this.init(true)
    }

    private readonly allowedMimeTypes = [".png", ".jpg", ".svg"]
    private readonly uploadsPath = path.join(process.cwd(), `uploads`)
    private errorDefaultCounter = 0

    private getRealPathAndCheckExsists(filePath: string) {
        const realPath = path.join(process.cwd(), `uploads`, `${filePath}`)

        if (!fs.existsSync(realPath)) throw new NotFoundException("File not exsists")

        return realPath
    }

    private async init(flag=false) {
        if (flag) {
            if (!fs.existsSync(this.uploadsPath)) await fs.promises.mkdir(this.uploadsPath) 
        }

        try {
            const defaultPng = (await fetch(`${this.configService.get(`API_CLIENT_URL`)}/public/default.png`)).body

            await fs.promises.writeFile(`${this.uploadsPath}/default.png`, defaultPng as unknown as Buffer)
        } catch(e) {
            this.errorDefaultCounter += 1

            if (this.errorDefaultCounter >= 5) {
                console.error(`Fetch default.png error (gte 5). Please, restart app (killed)`)
                process.exit(1)
            }

            setTimeout(async () => {
                await this.init()
            }, 5000)
        }
    }

    async downolad(file: Express.Multer.File): Promise<string> {
        const fileName = v4()
        const filePath = path.join(process.cwd(), `uploads`, `${fileName + path.extname(file.originalname)}`)

        await fs.promises.writeFile(filePath, file.buffer)

        return `${fileName + path.extname(file.originalname)}`
    } 

    get(res: Response, filePath: string) {
        const realPath = this.getRealPathAndCheckExsists(filePath)

        const file = fs.createReadStream(realPath)

        this.configService.get("NODE_ENV") === "test" ? null : res.header("Content-Type", `Image/${path.extname(filePath).replace(".", "")}`) 

        return file.pipe(res)
    }

    validateFileType(type: string): boolean {
        return this.allowedMimeTypes.includes(path.extname(type)) ? true: false
    }

    async delete(filePath: string) {
        if (filePath === "default.png") return;

        if (!this.validateFileType(filePath)) throw new BadRequestException("Cannot delete this file")

        const realPath = this.getRealPathAndCheckExsists(filePath)

        await fs.promises.unlink(realPath)
    }
}