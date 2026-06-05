import { ApiSchema, OmitType, PartialType } from '@nestjs/swagger';
import { UrlModel } from '../model/url.model';

@ApiSchema()
export class UrlUpdateDto extends OmitType(PartialType(UrlModel), [
  'shortcode',
  'created_at',
] as const) {}
