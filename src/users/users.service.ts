import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtUser } from '../auth/interfaces';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

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
}
