import { Injectable } from '@nestjs/common';
import { UrlModel } from '../model/url.model';

@Injectable()
export class CoreService {
  getHello(): string {
    return 'Hello World!';
  }

  getUrlByCode(code: string): UrlModel {
    return {} as UrlModel;
  }
}
