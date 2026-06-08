import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidUrlValidator } from '../validators/is-valid-url.validator';
import { IsValidCustomUrlValidator } from '../validators/is-valid-custom-url.validator';

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
  @IsValidUrlValidator()
  original_url: string;

  @Prop({ isRequired: false, default: null, index: true })
  @ApiProperty({
    nullable: true,
    description: 'Alias',
    example: 'hello-world',
    required: false,
  })
  @IsValidCustomUrlValidator()
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
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsDateString({ strict: true })
  expiration_date?: Date | null;

  @Prop({ allowNull: true, default: null })
  @ApiProperty({
    nullable: false,
    description: 'Password to update the existing URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;

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
