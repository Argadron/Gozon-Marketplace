import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtUser } from '../auth/interfaces';
import { FileService } from '../file.service';
import { Response } from 'express';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService,
                private readonly fileService: FileService
    ) {}

    async getProfile(user: JwtUser) {
        const User = await this.prismaService.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                products: true
            }
        })

        if (!User) throw new NotFoundException("User not found")

        delete User.updatedAt
        delete User.createdAt
        delete User.password

        return User
    }

    async getProfilePhoto(user: JwtUser, res: Response) {
        const { profilePhoto } = await this.getProfile(user)

        const file = this.fileService.get(res, profilePhoto)

        return file
    }
}
