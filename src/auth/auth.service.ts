import { ConflictException, Injectable} from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}

    async register(dto: AuthDto) {
        const User = await this.prismaService.user.findUnique({
            where: {
                username: dto.username
            }
        })

        if (User) throw new ConflictException("This username already exsits!")

        return await this.prismaService.user.create({
            data: {
                password: await bcrypt.hash(dto.password, 3),
                ...dto
            }
        })

        //TODO: установить nestjs/jwt (возвращать токены) + подумать че делать с профилем (загрузка файла)
    }
}
