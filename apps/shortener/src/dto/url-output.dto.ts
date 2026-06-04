import { ApiSchema, OmitType } from '@nestjs/swagger';
import { UrlModel } from '../model/url.model';

@ApiSchema()
export class UrlOutputDto
  extends OmitType(UrlModel, ['created_at'] as const)
  implements Partial<UrlModel> {}
