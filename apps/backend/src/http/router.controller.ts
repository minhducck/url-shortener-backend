import { Controller, Get, Inject, Param, Redirect } from '@nestjs/common';
import { ShortenerService } from '../../../shortener/src/service/shortener.service';

@Controller({
  path: '/',
  version: '',
})
export class RouterController {
  @Inject(ShortenerService) private readonly shortenService: ShortenerService;

  @Get('/not-found')
  notFound() {
    return 'Page not found';
  }

  @Get(':url_code')
  @Redirect()
  async redirect(@Param('url_code') urlCode: string) {
    const notFound = { url: 'not-found', code: 404, url_code: urlCode };
    try {
      const urlModel = await this.shortenService.getUrlByCode(urlCode);
      const today = new Date();
      if (urlModel.expiration_date && urlModel.expiration_date <= today) {
        return notFound;
      }

      return { url: urlModel.original_url, code: 302 };
    } catch (e) {
      return notFound;
    }
  }
}
