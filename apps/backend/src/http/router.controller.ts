import {
  Controller,
  Get,
  Inject,
  Param,
  Redirect,
  UseFilters,
} from '@nestjs/common';
import { ShortenerService } from '../../../shortener/src/service/shortener.service';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UrlNotFoundFilter } from '../filter/url-not-found.filter';

@Controller({
  path: '/',
  version: '',
})
export class RouterController {
  @Inject(ShortenerService) private readonly shortenService: ShortenerService;

  @Get(':url_code')
  @Redirect()
  @UseFilters(new UrlNotFoundFilter())
  @ApiOperation({ summary: 'Redirect URL.' })
  @ApiResponse({ status: 302, description: 'Redirect to destination URL.' })
  @ApiNotFoundResponse({ description: 'The URL is not valid or expired' })
  async redirect(@Param('url_code') urlCode: string) {
    const urlModel = await this.shortenService.getActiveUrlByCode(urlCode);
    return { url: urlModel.original_url, code: 302 };
  }
}
