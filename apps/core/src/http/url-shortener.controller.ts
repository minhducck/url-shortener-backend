import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CoreService } from '../service/core.service';
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

@Controller('/urls')
@ApiTags('Url Shortener')
export class UrlShortenerController {
  constructor(private readonly coreService: CoreService) {}

  @Get(':shortened_code')
  @ApiParam({ name: 'shortened_code', description: 'Url shortener' })
  @ApiOperation({ summary: 'Retrieve URL metadata by shortened code.' })
  @ApiResponse({ status: 200, description: 'Found the URL' })
  @ApiResponse({ status: 404, description: 'Shorted URL does not exist' })
  getUrlSetting(@Param('shortened_code') code: string): UrlModel {
    return this.coreService.getUrlByCode(code);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create shorten link for URL' })
  @ApiCreatedResponse({ description: 'URL shorten has been created.' })
  @ApiBody({ type: UrlCreationDto })
  create(@Body() metadata: UrlCreationDto) {
    /**
     * @Todo: Validate input
     *  - original: Must be a valid URL
     *  - customURL: Must be a valid and does not exist in DB
     *  -
     */
    return metadata;
  }

  @Put('/:shortened_code/:password')
  @ApiOperation({ summary: 'Update URL metadata by shortened code.' })
  update(
    @Param('shortened_code') code: string,
    @Param('password') password: string,
  ) {}

  @Delete('/:shortened_code/:password')
  @ApiOperation({ summary: 'Delete URL metadata by shortened code.' })
  @ApiNotFoundResponse({ description: 'Shorten code does not exist' })
  @ApiForbiddenResponse({ description: 'Password not correct.' })
  @ApiOkResponse({ description: 'URL has been removed' })
  delete(
    @Param('shortened_code') code: string,
    @Param('password') password: string,
  ): boolean {
    return true;
  }
}
