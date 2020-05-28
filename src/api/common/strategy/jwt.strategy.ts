import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CommonService } from '../common.service';
import { Payload } from '../interface/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: Payload) {
    if (!payload.userId || !payload.userRole) {
      throw CommonService.getHttpError('Token is missing or Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return { userId: payload.userId, userRole: payload.userRole };
  }
}
