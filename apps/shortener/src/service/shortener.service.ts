import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UrlModel, UrlModelDefinition } from '../model/url.model';
import { UrlCreationDto } from '../dto/url-creation.dto';
import { AlreadyExistedException } from '@libs/common/exception/already-existed.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeGeneratorService } from './code-generator.service';
import { generateULID } from '@libs/common/helper/generate-ulid';
import { pick } from 'lodash';
import { UrlUpdateDto } from '../dto/url-update.dto';

@Injectable()
export class ShortenerService {
  @InjectModel(UrlModelDefinition.name) urlModel: Model<UrlModel>;
  @Inject(CodeGeneratorService)
  private readonly codeGenerator: CodeGeneratorService;

  private fieldsAllowedToUpdate: (keyof UrlModel)[] = [
    'custom_url',
    'expiration_date',
    'original_url',
    'password',
  ];

  async getUrlByCode(code: string): Promise<UrlModel> {
    if (!(await this.isCodeExist(code))) {
      throw new NotFoundException('Url does not exist');
    }

    return await this.urlModel
      .findOne({ $or: [{ shortcode: code }, { custom_url: code }] })
      .then((result) => result!.toObject());
  }

  async getActiveUrlByCode(code: string): Promise<UrlModel> {
    const url = await this.getUrlByCode(code);
    const now = new Date();

    if (url.expiration_date && now > url.expiration_date) {
      throw new NotFoundException('Url does not exist');
    }

    return url;
  }

  async isCodeExist(code: string): Promise<boolean> {
    return (
      (await this.urlModel.exists({
        $or: [{ shortcode: code }, { custom_url: code }],
      })) !== null
    );
  }

  async create(metadata: UrlCreationDto) {
    if (metadata.custom_url && (await this.isCodeExist(metadata.custom_url))) {
      throw new AlreadyExistedException(
        'The custom url already exist in the system.',
      );
    }

    let code: string | undefined = undefined;
    let triedCount = 0;
    do {
      const tryCode = await this.codeGenerator.generateCode();
      if (!(await this.isCodeExist(tryCode))) {
        code = tryCode;
        break;
      }
      triedCount++;
    } while (triedCount < 10);

    if (!code) {
      throw new InternalServerErrorException('Unable to generate new code.');
    }

    if (!metadata.password) {
      metadata.password = generateULID().toString(36);
    }

    return this.urlModel
      .create({
        ...metadata,
        shortcode: code,
      })
      .then((result) => result.toObject());
  }

  async update(code: string, metadata: UrlUpdateDto) {
    const existingURL = await this.getUrlByCode(code);

    if (
      metadata.custom_url &&
      existingURL.custom_url !== metadata.custom_url &&
      (await this.isCodeExist(metadata.custom_url))
    ) {
      throw new AlreadyExistedException(
        'The custom url already exists in the system.',
      );
    }

    return this.urlModel
      .findOneAndUpdate(
        { shortcode: code },
        { $set: pick(metadata, this.fieldsAllowedToUpdate) },
        { returnDocument: 'after' },
      )
      .then((result) => result!.toObject());
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
