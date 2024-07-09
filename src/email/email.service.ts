import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transporter, createTransport } from "nodemailer";
import { EmailOptions } from "./interfaces";
import * as fs from 'fs'
import * as path from 'path'
import templater from '../helpers/templater'

@Injectable()
export class EmailService {
    private transporter: Transporter;

    constructor(private readonly configService: ConfigService) {
       this.transporter = createTransport({
           secure: true,
           host: configService.get("MAIL_HOST"),
           port: +configService.get("MAIL_PORT"),
           auth: {
               user: configService.get("MAIL_USER"),
               pass: configService.get("MAIL_PASSWORD")
           }
       })
    }

    async sendEmail(emailOptions: EmailOptions) {
        let html = await fs.promises.readFile(path.join("src", "email", "public", "public.html"), { encoding: "utf-8" })
        html = templater(html, emailOptions.templateObject)

        return await this.transporter.sendMail({
            from: this.configService.get("MAIL_USER"), 
            to: emailOptions.to,
            subject: emailOptions.subject,
            text: emailOptions.text,
            html
        })
    }
}