import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { v4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileService {
    private readonly allowedMimeTypes = [".png", ".jpg", ".svg"]

    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

    async downolad(file: Express.Multer.File): Promise<string> {
        if (!fs.existsSync(path.join(process.cwd(), "uploads"))) fs.mkdirSync(path.join(process.cwd(), "uploads"))

        const fileName = v4()
        const filePath = path.join(process.cwd(), `uploads`, `${fileName + path.extname(file.originalname)}`)

        await fs.promises.writeFile(filePath, file.buffer)

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

    async delete(filePath: string) {
        if (filePath === "default.png") return;

        if (!this.validateFileType(filePath)) throw new BadRequestException("Cannot delete this file")

        const realPath = path.join(process.cwd(), `uploads`, `${filePath}`)

        if (!fs.existsSync(realPath)) throw new BadRequestException("File not exsists")

        await fs.promises.unlink(realPath)
    }
}