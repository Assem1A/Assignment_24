import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tokenVerify } from '../utils/token';

type AuthRequest = Request & {
  user?: any;
};

@Injectable()
export class authMiddleware implements NestMiddleware {
  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [key, token] = authorization.split(' ');

    if (key !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    const decoded = await tokenVerify(
      token,
      process.env.JWT_SECRET as string,
    );

    req.user = decoded;

    next();
  }
}