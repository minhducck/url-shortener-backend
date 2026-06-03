import { PartialType } from '@nestjs/swagger';
import { UrlModel } from '../model/url.model';

export class UrlCreationDto extends PartialType(UrlModel) {}
