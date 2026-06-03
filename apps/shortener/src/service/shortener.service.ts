import { Injectable } from '@nestjs/common';
import { UrlModel } from '../model/url.model';
import {UrlCreationDto} from "../dto/url-creation.dto";
import {AlreadyExistedException} from "@libs/common/exception/already-existed.exception";

@Injectable()
export class ShortenerService {
  getHello(): string {
    return 'Hello World!';
  }

  getUrlByCode(code: string): UrlModel {
    return {
      original_url: 'https://google.com/',
      shortcode: code,
      password: 'tested',
      expiration_date: null,
      created_at: new Date()
    } as UrlModel;
  }

  async isCodeExist(code: string): Promise<boolean> {
    // @Todo: check if the code is already exist.
    return Promise.resolve(true)
  }

  async create(metadata: UrlCreationDto) {
    if (metadata.custom_url && await this.isCodeExist(metadata.custom_url)) {
      throw new AlreadyExistedException('The custom url already exist in the system.');
    }

    // @Todo: Persist data to database

    if (!metadata.custom_url) {
      
    }

    return Promise.resolve(metadata)
  }
}
