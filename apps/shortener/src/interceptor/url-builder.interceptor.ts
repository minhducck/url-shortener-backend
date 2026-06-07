import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UrlModel } from '../model/url.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlBuilderInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: UrlModel) => {
        return {
          ...data,
          shorten_url: new URL(
            data.custom_url || data.shortcode,
            this.configService.getOrThrow<string>(
              'APPLICATION_FRONTEND_DOMAIN',
            ),
          ),
        };
      }),
    );
  }
}
