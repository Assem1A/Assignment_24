import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { tokenVerify } from '../utils/token';

export interface IAuthReq extends Request {
  credentials?: any;
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(context);

    console.log({
      type: context.getType(),
      getHandler: context.getHandler(),
      class: context.getClass(),
    });

    let req!: IAuthReq;
    let authorization!: string;

    switch (context.getType()) {
      case 'http':
        req = context.switchToHttp().getRequest<IAuthReq>();
        authorization = req.headers.authorization as string;
        break;

      default:
        throw new UnauthorizedException('Unsupported request type');
    }

    if (!authorization) {
      throw new UnauthorizedException('Missing authorization');
    }

    const [key, credential] = authorization.split(' ') || [];

    console.log({ key, credential });

    if (!key || !credential) {
      throw new UnauthorizedException('Missing authorization');
    }

    switch (key) {
      case 'Basic': {
        const [username, password] = Buffer.from(credential, 'base64')
          .toString()
          .split(':');

        console.log({ username, password });

            break;
      }

      default: {
        req.credentials = await tokenVerify(
          credential,process.env.JWT_SECRET as string
        );

        break;
      }
    }

    return true;
  }
}