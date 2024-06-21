import { BadRequestException, ConflictException, Injectable} from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Tokens } from './interfaces';
import { FileService } from '../file.service';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService,
                private readonly fileService: FileService
    ) {}

    private async generateTokens(id: number) {
        const access = await this.jwtService.signAsync({
            id
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

    async register(res: Response, dto: AuthDto, file: Express.Multer.File=null): Promise<Tokens> {
        const User = await this.prismaService.user.findUnique({
            where: {
                username: dto.username
            }
        })

        if (User) throw new ConflictException("This username already exsits!")

        if (file) {
            if (!this.fileService.validateFileType(file.originalname)) throw new BadRequestException("Profile photo has invalid type")
        }

        delete dto.file
        const { id } = await this.prismaService.user.create({
            data: {
                password: await bcrypt.hash(dto.password, 3),
                ...dto,
                profilePhoto: file ? this.fileService.downolad(file) : "default.png"
            }
        })

        const { access, refresh } = await this.generateTokens(id)

        const NODE_ENV = this.configService.get("NODE_ENV")

        NODE_ENV === "development" || "test" ? null : this.sendRefreshToCookie(res, refresh)

        return NODE_ENV === "development" ? { access, refresh } : { access }
    }
}
