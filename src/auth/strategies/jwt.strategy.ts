import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { JwtUser } from "../interfaces";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_SECRET")
        })
    }

    async validate(payload: JwtUser) {
        return payload
    }
}