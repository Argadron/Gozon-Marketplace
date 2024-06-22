import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RoleEnum } from "@prisma/client";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest()

        return request.user["role"] === RoleEnum.ADMIN
    }
}