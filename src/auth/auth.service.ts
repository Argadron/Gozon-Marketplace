import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtUser, Tokens } from './interfaces';
import { FileService } from '../file.service';
import { RoleEnum } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService,
                private readonly fileService: FileService
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
        res.cookie(this.configService.get("REFRESH_TOKEN_COOKIE_NAME"), token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: this.configService.get("NODE_ENV") === "development" ? "none" : "lax"
        })
    }

    private async verifyJwt(token: string): Promise<JwtUser> {
        try {
            return await this.jwtService.verifyAsync(token)
        } catch(e) {
            throw new UnauthorizedException("Refresh token invalid")
        }
    }

    /**
     * This method check NODE_ENV variable and send refresh to cookie or return if mode equal development
     * @param access - Access token
     * @param refresh - Refresh token
     * @param res - Response from Express
     * @returns - Access and refresh tokens (or only access)
     */
    private async checkNodeEnvAndReturn(access: string, refresh: string, res: Response): Promise<Tokens> {
        const NODE_ENV = this.configService.get("NODE_ENV")

        NODE_ENV === "development" || "test" ? null : this.sendRefreshToCookie(res, refresh)

        return NODE_ENV === "development" || "test" ? { access, refresh } : { access }
    }

    async register(res: Response, dto: AuthDto, file: Express.Multer.File=null): Promise<Tokens> {
        const User = await this.prismaService.user.findFirst({
            where: {
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
            }
        })

        if (User) throw new ConflictException("This username or email or phone already exsits!")

        if (file) {
            if (!this.fileService.validateFileType(file.originalname)) throw new BadRequestException("Profile photo has invalid type")
        }

        delete dto.file
        const { password, ...addInfo } = dto
        const { id, role } = await this.prismaService.user.create({
            data: {
                password: await bcrypt.hash(password, 3),
                ...addInfo,
                profilePhoto: file ? this.fileService.downolad(file) : "default.png"
            }
        })

        const { access, refresh } = await this.generateTokens(id, role)

        await this.prismaService.tokens.create({
            data: {
                userId: id, 
                token: refresh
            }
        })

        return await this.checkNodeEnvAndReturn(access, refresh, res)
    }

    async login(res: Response, dto: Partial<AuthDto>) {
        const type = dto.email || dto.username || dto.phone

        if (!type) throw new BadRequestException("Missing one of 3 login methods")

        const User = await this.prismaService.user.findFirst({
            where: {
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
            }
        })

        if (!User) throw new NotFoundException("Bad password or username")

        if (!await bcrypt.compare(dto.password, User.password)) throw new BadRequestException("Bad password or username")

        if (!await this.prismaService.tokens.findUnique({
            where: {
                userId: User.id
            }
        })) throw new BadRequestException("Refresh Token not found")

        const { access, refresh } = await this.generateTokens(User.id, User.role)

        await this.prismaService.tokens.update({
            where: {
                userId: User.id
            },
            data: {
                token: refresh
            }
        })

        return await this.checkNodeEnvAndReturn(access, refresh, res)
    }

    async refresh(token: string, res: Response) {
        const tokensObject = await this.prismaService.tokens.findFirst({
            where: {
                token
            }
        })

        if (!tokensObject) throw new UnauthorizedException("Refresh token not found")

        await this.verifyJwt(token)

        const User = await this.prismaService.user.findUnique({
            where: {
                id: tokensObject.userId
            }
        })

        const { access, refresh } = await this.generateTokens(User.id, User.role)

        await this.prismaService.tokens.update({
            where: {
                userId: tokensObject.userId
            },
            data: {
                token: refresh
            }
        })

        return await this.checkNodeEnvAndReturn(access, refresh, res)
    }
}
