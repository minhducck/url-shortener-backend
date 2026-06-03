import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UrlModel, UrlModelDefinition } from '../model/url.model';
import { UrlCreationDto } from '../dto/url-creation.dto';
import { AlreadyExistedException } from '@libs/common/exception/already-existed.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeGeneratorService } from './code-generator.service';
import { UnableToSaveException } from '@libs/common/exception/unable-to-save.exception';
import { generateULID } from '@libs/common/helper/generate-ulid';
import { pick } from 'lodash';

@Injectable()
export class ShortenerService {
  @InjectModel(UrlModelDefinition.name) urlModel: Model<UrlModel>;
  @Inject(CodeGeneratorService)
  private readonly codeGenerator: CodeGeneratorService;

  private fieldsAllowedToUpdate: (keyof UrlModel)[] = [
    'shortcode',
    'password',
    'original_url',
  ];

  getHello(): string {
    return 'Hello World!';
  }

  async getUrlByCode(code: string): Promise<UrlModel> {
    if (!(await this.isCodeExist(code))) {
      throw new NotFoundException('Url does not exist');
    }

    return (await this.urlModel.findOne({ shortcode: code }))!;
  }

  async isCodeExist(code: string): Promise<boolean> {
    return (await this.urlModel.exists({ shortcode: code })) !== null;
  }

  async create(metadata: UrlCreationDto) {
    if (metadata.custom_url && (await this.isCodeExist(metadata.custom_url))) {
      throw new AlreadyExistedException(
        'The custom url already exist in the system.',
      );
    }

    if (!metadata.custom_url) {
      const code = (await this.codeGenerator.generateCodes(1))[0];
      if (!code) {
        throw new UnableToSaveException('Unable to generate new code.');
      }

      metadata.custom_url = code;
    }

    if (!metadata.password) {
      metadata.password = generateULID().toString(36);
    }

    return this.urlModel.create({
      ...metadata,
      shortcode: metadata.custom_url,
    });
  }

  async update(code: string, metadata: Partial<UrlModel>) {
    return this.urlModel.findOneAndUpdate(
      { shortcode: code },
      { $set: pick(metadata, this.fieldsAllowedToUpdate) },
      { returnDocument: 'after' },
    );
  }

  async isAbleToChange(code: string, password: string) {
    return this.urlModel
      .exists({ shortcode: code, password: password })
      .then((response) => response !== null);
  }

  async remove(code: string) {
    return this.urlModel.deleteOne({ shortcode: code });
  }
}
