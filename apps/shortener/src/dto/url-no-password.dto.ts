import { ApiSchema, OmitType } from '@nestjs/swagger';
import { UrlModel } from '../model/url.model';
import { Exclude } from 'class-transformer';

@ApiSchema({
  name: 'UrlModel',
  description: 'Metadata for Shorten URL without Password',
})
export class UrlNoPasswordDto
  extends OmitType(UrlModel, ['created_at'] as const)
  implements Partial<UrlModel>
{
  @Exclude()
  password: string;
}
