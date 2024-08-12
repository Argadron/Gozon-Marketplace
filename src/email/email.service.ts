import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import templater from '@helpers/templater'
import { checkMinsTimeFromDateToCurrent } from "@helpers/date";
import { twoFactorAuthEnum } from "@prisma/client";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../prisma.service";
import { CreateTag, EmailOptions } from "./interfaces";
import { JwtUser } from "../auth/interfaces";
import * as fs from 'fs'
import * as path from 'path'
import { v4 } from 'uuid'
import { Transporter, createTransport } from "nodemailer";

@Injectable()
export class EmailService {
    private transporter: Transporter;

    constructor(private readonly configService: ConfigService,
                private readonly usersService: UsersService,
                private readonly prismaService: PrismaService
    ) {
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

    async createVerification(user: JwtUser) {
        const User = await this.usersService.findBy({ id: user.id })

        if (!User) throw new NotFoundException("User not found")

        if (User.isEmailVerify && this.configService.get("NODE_ENV") !== "test") throw new ConflictException("Already has verification")

        if (!User.email) throw new BadRequestException("User not has email")

        const check = await this.findTagByUserId(User.id)

        if (check) {
            if (!checkMinsTimeFromDateToCurrent(check.createdAt, 5)) {
                throw new ConflictException("Already send email (lt 5 mins from last)")
            }
            else {
                await this.prismaService.emailConfirms.delete({
                    where: {
                        userId: User.id
                    }
                })
            }
        }

        const urlTag = v4()

        await this.sendEmail({
            to: User.email,
            text: "Email confirm",
            subject: "Confirm email - Gozon Marketplace",
            templateObject: {
                action: "email verification",
                name: User.username,
                url: `${this.configService.get("API_CLIENT_URL")}/verificationEmail/?urlTag=${urlTag}`
            }
        })

        return this.configService.get("NODE_ENV") !== "test" ? null : await this.createTag({ userId: user.id, urlTag })
    }

    async validateTag(tag: string) {
        const verifyObject = await this.prismaService.emailConfirms.findUnique({
            where: {
                urlTag: tag
            }
        })

        if (!verifyObject) throw new NotFoundException("Tag not found")

        await this.usersService.update({
            isEmailVerify: true
        }, verifyObject.userId)
       
        await this.deleteTagByUserId(verifyObject.userId)
    }

    async findTagByUserId(userId: number) {
        return await this.prismaService.emailConfirms.findUnique({
            where: {
                userId
            }
        })
    }

    async deleteTagByUserId(userId: number) {
        return await this.prismaService.emailConfirms.delete({
            where: {
                userId
            }
        })
    }

    async createTag(data: CreateTag) {
        return await this.prismaService.emailConfirms.create({
            data
        })
    }

    async sendEmailWithCreateTag(emailOptions: EmailOptions, tagOptions: CreateTag) {
        await this.sendEmail(emailOptions)
        this.configService.get("NODE_ENV") === "test" ? null : await this.createTag(tagOptions)
    }

    async twoFactorAuth(user: JwtUser, urlTag?: string) {
        const check = await this.findTagByUserId(user.id)
        const User = await this.usersService.findBy({ id: user.id })
        const twoFactorCheck = User.twoFactorAuth === twoFactorAuthEnum.EMAIL ? "Disconnect":"Connect"

        if (!User.isEmailVerify) throw new BadRequestException("User not has verified email")

        if (User.twoFactorAuth === twoFactorAuthEnum.TELEGRAM && this.configService.get("NODE_ENV") !== "test") throw new BadRequestException("Already has two factor auth (Telegram)")

        const authTag = v4()
        const emailObject = {
            subject: `${twoFactorCheck} twoFactorAuth`, 
            to: User.email,
            text: `twoFactorAuth`,
            templateObject: {
                action: `${twoFactorCheck} twoFactorAuth`,
                name: User.username,
                url: `${this.configService.get("API_CLIENT_URL")}/enable-email-twofactor?urlTag=${authTag}`
            }
        }
        const tagObject = {
            userId: User.id, 
            urlTag: authTag
        }

        if (!urlTag) {
            if (check) {
                if (checkMinsTimeFromDateToCurrent(check.createdAt, 5)) {
                    await this.deleteTagByUserId(user.id)
                    await this.sendEmailWithCreateTag(emailObject, tagObject)
                }
                else {
                    throw new ConflictException("Already send email (lt 5 mins from last)")
                }
            }
            else {
                await this.sendEmailWithCreateTag(emailObject, tagObject)
            }

            return `Send email to ${twoFactorCheck} twoFactorAuth`
        }
        else {
            const findTag = await this.findTagByUserId(User.id)
 
            if (!findTag) throw new NotFoundException("Tag not found")

            if (findTag.urlTag !== urlTag) throw new BadRequestException("Tags not match")

            await this.deleteTagByUserId(User.id)
            await this.usersService.update({
                twoFactorAuth: User.twoFactorAuth === twoFactorAuthEnum.EMAIL ? twoFactorAuthEnum.NONE : twoFactorAuthEnum.EMAIL
            }, User.id)

            return `Twofactorauth ${twoFactorCheck}`
        }
    }

    async findUserIdByTag(urlTag: string) {
        return await this.prismaService.emailConfirms.findUnique({
            where: {
                urlTag
            }
        })
    }
}