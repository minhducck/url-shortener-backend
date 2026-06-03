import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
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
  @ApiProperty({ nullable: false, description: 'Original URL' })
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

  @Prop({
    type: 'Date',
    allowNull: true,
    default: null,
  })
  @ApiProperty({ nullable: true, description: 'URL expiration date' })
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
