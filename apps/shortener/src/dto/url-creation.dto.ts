import {OmitType} from '@nestjs/swagger';
import {UrlModel} from '../model/url.model';
import {IsNotEmpty, IsOptional, IsString, IsUrl, Matches} from "class-validator";

export class UrlCreationDto extends OmitType(UrlModel, ['created_at', 'shortcode'] as const) {
  @IsString()
  @Matches(/^[a-zA-Z\-_0-9]+$/)
  @IsOptional()
  custom_url?: string;
}
