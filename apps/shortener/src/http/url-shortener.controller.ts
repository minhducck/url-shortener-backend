import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ShortenerService } from '../service/shortener.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UrlCreationDto } from '../dto/url-creation.dto';
import { UrlBuilderInterceptor } from '../interceptor/url-builder.interceptor';
import { PasswordProtectedGuard } from '../guard/password-protected.guard';
import { UrlUpdateDto } from '../dto/url-update.dto';
import { UrlOutputDto } from '../dto/url-output.dto';
import { wrapTimeMeasure } from '@libs/common/helper/wrap-time-measure';

@Controller({
  version: 'V1',
  path: '/urls',
})
@ApiTags('Url Shortener')
export class UrlShortenerController {
  private readonly logger: Logger = new Logger('UrlShortenerController');

  constructor(private readonly coreService: ShortenerService) {}

  @Get(':code')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(UrlBuilderInterceptor)
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @ApiParam({ name: 'code', description: 'Url shortener' })
  @ApiOperation({ summary: 'Retrieve URL metadata by shortened code.' })
  @ApiResponse({ status: 200, description: 'Found the URL' })
  @ApiResponse({ status: 404, description: 'Shorted URL does not exist' })
  getUrlSetting(@Param('code') code: string): Promise<UrlOutputDto> {
    return this.coreService.getUrlByCode(code);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create shorten link for URL' })
  @ApiCreatedResponse({ description: 'URL shorten has been created.' })
  @ApiBody({ type: UrlCreationDto })
  @ApiConflictResponse({ description: 'Custom URL already exists.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(UrlBuilderInterceptor)
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  async create(@Body() metadata: UrlCreationDto): Promise<UrlOutputDto> {
    return wrapTimeMeasure(
      () => this.coreService.create(metadata),
      'Create URL',
      this.logger,
    );
  }

  @Put('/:code/:password')
  @UseGuards(PasswordProtectedGuard)
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(UrlBuilderInterceptor)
  @ApiBody({ type: UrlUpdateDto })
  @ApiOperation({ summary: 'Update URL metadata by shortened code.' })
  async update(
    @Param('code') code: string,
    @Param('password') password: string,
    @Body() content: UrlUpdateDto,
  ): Promise<UrlOutputDto> {
    return wrapTimeMeasure(
      () => this.coreService.update(code, content),
      'Update URL',
      this.logger,
    );
  }

  @Delete('/:code/:password')
  @UseGuards(PasswordProtectedGuard)
  @ApiOperation({ summary: 'Delete URL metadata by shortened code.' })
  @ApiNotFoundResponse({ description: 'Shorten code does not exist' })
  @ApiForbiddenResponse({ description: 'Password not correct.' })
  @ApiOkResponse({ description: 'URL has been removed' })
  async delete(
    @Param('code') code: string,
    @Param('password') password: string,
  ): Promise<boolean> {
    await this.coreService.remove(code);

    return true;
  }
}
