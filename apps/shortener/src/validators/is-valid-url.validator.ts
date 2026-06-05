import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export function IsValidUrlValidator() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    MinLength(10),
    MaxLength(256),
    IsUrl(
      {
        allow_fragments: false,
        max_allowed_length: 256,
        allow_query_components: true,
        require_protocol: true,
        require_host: true,
        require_valid_protocol: true,
        require_tld: false,
        protocols: ['http', 'https'],
      },
      {
        message: 'URL should be a valid HTTP/HTTPS value.',
      },
    ),
  );
}
