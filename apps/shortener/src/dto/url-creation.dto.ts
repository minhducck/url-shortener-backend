import { OmitType } from '@nestjs/swagger';
import { UrlModel } from '../model/url.model';

export class UrlCreationDto extends OmitType(UrlModel, [
  'created_at',
  'shortcode',
] as const) {}
