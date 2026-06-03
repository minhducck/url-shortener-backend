import {ApiProperty} from '@nestjs/swagger';
import {IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl} from "class-validator";

export class UrlModel {
  @ApiProperty({
    nullable: false,
    description: 'Shorten URL',
    example: 'abc123',
  })
  readonly shortcode: string;

  @ApiProperty({nullable: false, description: 'Original URL'})
  @IsNotEmpty()
  @IsUrl({
    allow_fragments: false,
    max_allowed_length: 256,
    allow_query_components: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    require_tld: false,
  })
  original_url: string;

  @ApiProperty({nullable: true, description: 'URL expiration date'})
  @IsOptional()
  @IsDateString({strict: true})
  expiration_date: Date | null;

  @ApiProperty({
    nullable: false,
    description: 'Password to update the existing URL',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password: string;

  @ApiProperty({nullable: false, description: 'Created date'})
  readonly created_at: Date;
}
