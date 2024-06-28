import { PrismaClient } from "@prisma/client";

let prismaTestClient: PrismaClient;

export default () => {
    return prismaTestClient ? prismaTestClient: new PrismaClient()
}