import { ApiSchema, OmitType } from '@nestjs/swagger';
import { UrlModel } from '../model/url.model';

@ApiSchema({
  name: 'UrlModel',
  description: 'Metadata for Shorten URL',
})
export class UrlOutputDto
  extends OmitType(UrlModel, ['created_at'] as const)
  implements Partial<UrlModel> {}
