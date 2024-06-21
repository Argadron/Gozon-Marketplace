import { Injectable } from "@nestjs/common";
import { v4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'
import { Response } from "express";

@Injectable()
export class FileService {
    private readonly allowedMimeTypes = [".png", ".jpg", ".svg"]

    downolad(file: Express.Multer.File): string {
        const fileName = v4()
        const filePath = path.join(process.cwd(), `uploads`, `${fileName}.${file.originalname.split(".")[1]}`)

        fs.writeFileSync(filePath, file.buffer, { encoding: `utf-8` })

        return `${fileName + path.extname(file.originalname)}`
    } 

    get(res: Response, filePath: string) {
        const realPath = path.join(process.cwd(), `uploads`, `${filePath}`)
        const file = fs.createReadStream(realPath)

        return file.pipe(res)
    }

    validateFileType(type: string): boolean {
        return this.allowedMimeTypes.includes(path.extname(type)) ? true: false
    }
}