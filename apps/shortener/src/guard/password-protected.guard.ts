import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ShortenerService } from '../service/shortener.service';
import { Request } from 'express';

@Injectable()
export class PasswordProtectedGuard implements CanActivate {
  constructor(private readonly service: ShortenerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const password = String(request.params['password']);
    const code = String(request.params['code']);
    if (!password) {
      throw new UnauthorizedException('Password is required');
    }

    if (!(await this.service.isAbleToChange(code, password))) {
      throw new BadRequestException(
        'Incorrect password or URL does not exist!',
      );
    }

    return Promise.resolve(true);
  }
}
