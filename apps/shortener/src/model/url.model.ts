import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

@ApiSchema()
@Schema()
export class UrlModel {
  @Prop({ unique: true, isRequired: true, index: true })
  @ApiProperty({
    nullable: false,
    description: 'Shorten URL',
    example: 'abc123',
  })
  readonly shortcode: string;

  @Prop({ isRequired: true })
  @ApiProperty({
    nullable: false,
    description: 'Original URL',
    example: 'https://google.com/',
  })
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

  @Prop({ isRequired: false, default: null, index: true })
  @ApiProperty({
    nullable: true,
    description: 'Alias',
    example: 'hello-world',
  })
  @IsString()
  @Matches(/^[a-zA-Z\-_0-9]+$/)
  @IsOptional()
  custom_url?: string;

  @Prop({
    type: 'Date',
    allowNull: true,
    default: null,
  })
  @ApiProperty({
    nullable: true,
    description: 'URL expiration date',
    example: '2026-06-04T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  expiration_date: Date | null;

  @Prop({ allowNull: true, default: null })
  @ApiProperty({
    nullable: false,
    description: 'Password to update the existing URL',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password: string;

  @Prop()
  @ApiProperty({ nullable: false, description: 'Created date' })
  readonly created_at: Date;
}

export type UrlDocument = HydratedDocument<UrlModel>;

export const UrlSchema = SchemaFactory.createForClass(UrlModel);
export const UrlModelDefinition: ModelDefinition = {
  name: 'urls',
  schema: UrlSchema,
};
