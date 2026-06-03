import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ShortenerService } from '../service/shortener.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UrlModel } from '../model/url.model';
import { UrlCreationDto } from '../dto/url-creation.dto';
import {AlreadyExistedException} from "@libs/common/exception/already-existed.exception";

@Controller({
  version: '1',
  path: '/urls',
})
@ApiTags('Url Shortener')
export class UrlShortenerController {
  constructor(private readonly coreService: ShortenerService) {}

  @Get(':code')
  @ApiParam({ name: 'code', description: 'Url shortener' })
  @ApiOperation({ summary: 'Retrieve URL metadata by shortened code.' })
  @ApiResponse({ status: 200, description: 'Found the URL' })
  @ApiResponse({ status: 404, description: 'Shorted URL does not exist' })
  getUrlSetting(@Param('code') code: string): UrlModel {
    return this.coreService.getUrlByCode(code);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create shorten link for URL' })
  @ApiCreatedResponse({ description: 'URL shorten has been created.' })
  @ApiBody({ type: UrlCreationDto })
  async create(@Body() metadata: UrlCreationDto) {
    /**
     * @Todo: Validate input
     *  - original: Must be a valid URL
     *  - customURL: Must be a valid and does not exist in DB
     *  -
     */


    return this.coreService.create(metadata);
  }

  @Put('/:code/:password')
  @ApiOperation({ summary: 'Update URL metadata by shortened code.' })
  update(
    @Param('code') code: string,
    @Param('password') password: string,
  ) {}

  @Delete('/:code/:password')
  @ApiOperation({ summary: 'Delete URL metadata by shortened code.' })
  @ApiNotFoundResponse({ description: 'Shorten code does not exist' })
  @ApiForbiddenResponse({ description: 'Password not correct.' })
  @ApiOkResponse({ description: 'URL has been removed' })
  delete(
    @Param('code') code: string,
    @Param('password') password: string,
  ): boolean {
    return true;
  }
}
