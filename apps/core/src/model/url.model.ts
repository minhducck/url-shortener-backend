import { ApiProperty } from '@nestjs/swagger';

export class UrlModel {
  @ApiProperty({
    nullable: false,
    description: 'Shorten URL',
    example: 'abc123',
  })
  shortcode: string;

  @ApiProperty({ nullable: false, description: 'Original URL' })
  original_url: string;

  @ApiProperty({ nullable: true, description: 'URL expiration date' })
  expiration_date: Date | null;

  @ApiProperty({
    nullable: false,
    description: 'Password to update the existing URL',
  })
  password: string;

  @ApiProperty({ nullable: false, description: 'Created date' })
  created_at: Date;
}
