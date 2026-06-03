import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
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
import { CodeGeneratorService } from '../service/code-generator.service';
import { UrlBuilderInterceptor } from '../interceptor/url-builder.interceptor';

@Controller({
  version: '1',
  path: '/urls',
})
@ApiTags('Url Shortener')
export class UrlShortenerController {
  constructor(
    private readonly coreService: ShortenerService,
    private readonly codeGen: CodeGeneratorService,
  ) {}

  @Get('/generate-code')
  generate(@Query('n') n: number) {
    return this.codeGen.generateCodes(n);
  }

  @Get(':code')
  @ApiParam({ name: 'code', description: 'Url shortener' })
  @ApiOperation({ summary: 'Retrieve URL metadata by shortened code.' })
  @ApiResponse({ status: 200, description: 'Found the URL' })
  @ApiResponse({ status: 404, description: 'Shorted URL does not exist' })
  getUrlSetting(@Param('code') code: string) {
    return this.coreService.getUrlByCode(code);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create shorten link for URL' })
  @ApiCreatedResponse({ description: 'URL shorten has been created.' })
  @ApiBody({ type: UrlCreationDto })
  @UseInterceptors(UrlBuilderInterceptor)
  async create(@Body() metadata: UrlCreationDto) {
    /**
     * @Todo: Validate input
     *  - adding short_url to the response
     */

    return this.coreService.create(metadata);
  }

  @Put('/:code/:password')
  @UseInterceptors(UrlBuilderInterceptor)
  @ApiOperation({ summary: 'Update URL metadata by shortened code.' })
  async update(
    @Param('code') code: string,
    @Param('password') password: string,
    @Body() content: Omit<UrlModel, 'shortcode' | 'created_at' | 'password'>,
  ) {
    if (!(await this.coreService.isAbleToChange(code, password))) {
      throw new BadRequestException(
        'Incorrect password or URL does not exist!',
      );
    }
    return this.coreService.update(code, content);
  }

  @Delete('/:code/:password')
  @ApiOperation({ summary: 'Delete URL metadata by shortened code.' })
  @ApiNotFoundResponse({ description: 'Shorten code does not exist' })
  @ApiForbiddenResponse({ description: 'Password not correct.' })
  @ApiOkResponse({ description: 'URL has been removed' })
  async delete(
    @Param('code') code: string,
    @Param('password') password: string,
  ): Promise<boolean> {
    if (!(await this.coreService.isAbleToChange(code, password))) {
      throw new BadRequestException(
        'Incorrect password or URL does not exist!',
      );
    }

    await this.coreService.remove(code);

    return true;
  }
}
