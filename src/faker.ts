import { RoleEnum } from '@prisma/client'
import prismaForTest from './prisma-client.forTest'

const prisma = prismaForTest()

async function fakeDb() {
    await prisma.user.create({
        data: {
            id: 3,
            role: RoleEnum.ADMIN,
            username: "testadmin",
            password: "testpassword",
            profilePhoto: "default.png"
        }
    })
    await prisma.user.create({
        data: {
            id: 32,
            role: RoleEnum.USER,
            username: "testuser",
            password: "testpassword",
            profilePhoto: "default.png"
        }
    })
    await prisma.user.create({
        data: {
            id: 64,
            role: RoleEnum.SELLER,
            username: "testseller",
            password: "testpassword",
            profilePhoto: "default.png"
        }
    })
}
fakeDb()