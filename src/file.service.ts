import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { v4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileService {
    private readonly allowedMimeTypes = [".png", ".jpg", ".svg"]

    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

    downolad(file: Express.Multer.File): string {
        const fileName = v4()
        const filePath = path.join(process.cwd(), `uploads`, `${fileName + path.extname(file.originalname)}`)

        fs.writeFileSync(filePath, file.buffer, { encoding: `utf-8` })

        return `${fileName + path.extname(file.originalname)}`
    } 

    get(res: Response, filePath: string) {
        const realPath = path.join(process.cwd(), `uploads`, `${filePath}`)

        if (!fs.existsSync(realPath)) throw new NotFoundException("File not found")

        const file = fs.createReadStream(realPath)

        this.configService.get("NODE_ENV") === "test" ? null : res.header("Content-Type", `Image/${path.extname(filePath).replace(".", "")}`) 

        return file.pipe(res)
    }

    validateFileType(type: string): boolean {
        return this.allowedMimeTypes.includes(path.extname(type)) ? true: false
    }
}