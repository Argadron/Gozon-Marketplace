import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtUser, Tokens } from './interfaces';
import { FileService } from '../file.service';
import { RoleEnum, twoFactorAuthEnum } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailService } from '../email/email.service';
import { v4 } from 'uuid'
import { ResetPasswordDto } from './dto/reset-password.dto';
import { checkMinsTimeFromDateToCurrent } from '@helpers/date';
import { EnableTwoFactorDto } from './dto/enable-two-factor.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService,
                private readonly fileService: FileService,
                private readonly userService: UsersService,
                private readonly emailService: EmailService,
                private readonly telegramService: TelegramService
    ) {}

    private async generateTokens(id: number, role: RoleEnum) {
        const access = await this.jwtService.signAsync({
            id, role
        }, {
            expiresIn: this.configService.get("JWT_ACCESS_EXPIRES")
        })

        const refresh = await this.jwtService.signAsync({
            id
        }, {
            expiresIn: this.configService.get("JWT_REFRESH_EXPIRES")
        })

        return { access, refresh }
    }

    private sendRefreshToCookie(res: Response, token: string) {
        if (this.configService.get("NODE_ENV") === "test") return;

        res.cookie(this.configService.get("REFRESH_TOKEN_COOKIE_NAME"), token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: this.configService.get("NODE_ENV") === "development" ? "none" : "lax",
            domain: `${this.configService.get("CLIENT_DOMAIN")}${this.configService.get("HOST")}`,
            secure: true
        })
    }

    private clearRefreshFromCookie(res: Response) {
        res.cookie(this.configService.get("REFRESH_TOKEN_COOKIE_NAME"), "", {
            maxAge: 0
        })
    }

    private async verifyJwt(token: string): Promise<JwtUser> {
        try {
            return await this.jwtService.verifyAsync(token)
        } catch(e) {
            throw new UnauthorizedException("Refresh token invalid")
        }
    }

    async register(res: Response, dto: AuthDto, file: Express.Multer.File=null): Promise<Tokens> {
        const User = await this.userService.findBy({ 
            OR: [
                {
                    username: dto.username ? dto.username : undefined
                },
                {
                    email: dto.email ? dto.email : undefined
                },
                {
                    phone: dto.phone ? dto.phone : undefined
                }
            ] 
        })

        if (User) throw new ConflictException("This username or email or phone already exsits!")

        if (file) {
            if (!this.fileService.validateFileType(file.originalname)) throw new BadRequestException("Profile photo has invalid type")
        }

        delete dto.file

        const { password, ...addInfo } = dto
        const { id, role } = await this.userService.create({ 
            password: await bcrypt.hash(password, 3),
            ...addInfo,
            profilePhoto: file ? await this.fileService.downolad(file) : "default.png" 
        })

        const { access, refresh } = await this.generateTokens(id, role)

        await this.prismaService.tokens.create({
            data: {
                userId: id, 
                token: refresh
            }
        })

        this.sendRefreshToCookie(res, refresh)

        return { access }
    }

    async login(res: Response, dto: Partial<AuthDto>) {
        const type = dto.email || dto.username || dto.phone

        if (!type) throw new BadRequestException("Missing one of 3 login methods")

        const User = await this.userService.findBy({ 
            OR: [
                {
                    username: type
                },
                {
                    email: type
                },
                {
                    phone: type
                }
            ]
        })

        if (!User) throw new NotFoundException("Bad password or username")

        if (!await bcrypt.compare(dto.password, User.password)) throw new BadRequestException("Bad password or username")

        if (!await this.prismaService.tokens.findUnique({
            where: {
                userId: User.id
            }
        })) throw new BadRequestException("Refresh Token not found")

        if (User.isBanned) throw new ForbiddenException("User are banned")

        const { access, refresh } = await this.generateTokens(User.id, User.role)

        await this.prismaService.tokens.update({
            where: {
                userId: User.id
            },
            data: {
                token: refresh
            }
        })

        this.sendRefreshToCookie(res, refresh)

        return { access }
    }

    async refresh(token: string, res: Response) {
        const tokensObject = await this.prismaService.tokens.findFirst({
            where: {
                token
            }
        })

        if (!tokensObject && this.configService.get("NODE_ENV") !== "test") throw new UnauthorizedException("Refresh token not found")
            
        await this.verifyJwt(token)

        const User = await this.userService.findBy({ 
            id: tokensObject.userId
        })

        if (User.isBanned) throw new ForbiddenException("User are banned")

        const { access, refresh } = await this.generateTokens(User.id, User.role)

        await this.prismaService.tokens.update({
            where: {
                userId: tokensObject.userId
            },
            data: {
                token: refresh
            }
        })

        this.configService.get("NODE_ENV") === "test" ? null : this.sendRefreshToCookie(res, refresh)

        return { access }
    }

    async logout(user: JwtUser, res: Response) {
        this.configService.get("NODE_ENV") === "production" ? this.clearRefreshFromCookie(res) : null

        return await this.prismaService.tokens.update({
            where: {
                userId: user.id
            },
            data: {
                token: ""
            }
        })
    }

    async changePassword(dto: ChangePasswordDto, user: JwtUser, tag?: string) {
        const User = await this.userService.findBy({ id: user.id })

        if (!(await bcrypt.compare(dto.oldPassword, User.password))) throw new BadRequestException("Passwords not match")

        if (User.isEmailVerify) {
            const checkObject = await this.emailService.findTagByUserId(User.id)

            if (!tag) {
                const urlTag = v4()
                const emailOptions = {
                    to: User.email,
                    subject: "Change password",
                    text: "Change your password",
                    templateObject: {
                        action: "Change password",
                        name: User.username,
                        url: `${this.configService.get("API_CLIENT_URL")}/change-password?urlTag=${urlTag}`
                    }
                }
                const tagOptions = {
                    userId: User.id,
                    urlTag
                }

                if (checkObject) {
                    if (checkMinsTimeFromDateToCurrent(checkObject.createdAt, 5)) {
                        await this.emailService.deleteTagByUserId(User.id)
                        await this.emailService.sendEmailWithCreateTag(emailOptions, tagOptions)
                    }
                    else {
                        if (this.configService.get("NODE_ENV") !== "test") throw new ConflictException("Already send email (lt 5 mins from last)")
                    }
                }
                else {
                    await this.emailService.sendEmailWithCreateTag(emailOptions, tagOptions)
                }

                return "Send email to change password"
            }
            else {
                if (!checkObject) throw new NotFoundException("Tag not found")

                if (checkObject.urlTag !== tag) throw new BadRequestException("Tags not match")
        
                await this.emailService.deleteTagByUserId(User.id)
            }
        }

        await this.userService.update({ password: await bcrypt.hash(dto.newPassword, 3) }, user.id)

        return "Password changed"
    }

    async resetPassword(dto: ResetPasswordDto, urlTag?: string) {
        const User = await this.userService.findBy({ username: dto.username })

        if (!User) throw new NotFoundException("User not found")

        if (!User.isEmailVerify) throw new BadRequestException("Cannot reset password: User not has verified email")// не запустит

        const emailMessage = await this.emailService.findTagByUserId(User.id)

        if (!urlTag) {
            const tag = v4()
            const emailOptions = {
                to: User.email,
                subject: "Reset password",
                text: "Reset your password",
                templateObject: {
                    action: "Reset password",
                    name: User.username,
                    url: `${this.configService.get("API_CLIENT_URL")}/reset-password?urlTag=${tag}`
                }
            }
            const tagOptions = {
                userId: User.id,
                urlTag: tag
            }
    
            if (emailMessage) {
                if (checkMinsTimeFromDateToCurrent(emailMessage.createdAt, 5)) {
                    await this.emailService.deleteTagByUserId(User.id)
                    await this.emailService.sendEmailWithCreateTag(emailOptions, tagOptions)
                } 
                else {
                    if (this.configService.get("NODE_ENV") !== "test") throw new ConflictException("Already send email (lt 5 mins from last)")
                }
            }
            else {
                await this.emailService.sendEmailWithCreateTag(emailOptions, tagOptions)
            }
    
            return "Send email to reset password"
        }
        else {
            if (!emailMessage) throw new NotFoundException("Tag not found")

            if (emailMessage.urlTag !== urlTag) throw new BadRequestException("Tags not match")

            if (!dto.newPassword) throw new BadRequestException("Validataion failed: newPassword is required")

            await this.userService.update({ password: await bcrypt.hash(dto.newPassword, 3) }, User.id)
            await this.emailService.deleteTagByUserId(User.id)

            return "Password reseted"
        }
    }
}
