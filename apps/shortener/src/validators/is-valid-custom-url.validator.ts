import { applyDecorators } from '@nestjs/common';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export function IsValidCustomUrlValidator() {
  return applyDecorators(
    IsString(),
    Matches(/^[a-zA-Z\-_0-9]+$/),
    IsOptional(),
    MinLength(3),
    MaxLength(50),
  );
}
