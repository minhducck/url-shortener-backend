import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GlobalCounterDefinition,
  GlobalCounterDocument,
  GlobalCounterModel,
} from '../model/global-counter.model';
import { toBase62 } from '../helper/base62.encoder';

@Injectable()
export class CodeGeneratorService implements OnApplicationBootstrap {
  @Inject(ConfigService) private readonly configService: ConfigService;

  @InjectModel(GlobalCounterDefinition.name)
  private readonly globalCounterModel: Model<GlobalCounterModel>;
  private globalCounterCode: string = 'GLOBAL_COUNTER';

  constructor() {}

  async onApplicationBootstrap() {
    this.globalCounterCode = this.configService.get(
      'GLOBAL_COUNTER_CODE',
      'GLOBAL_COUNTER',
    );

    const isExist = await this.globalCounterModel.exists({
      code: this.globalCounterCode,
    });

    if (isExist === null) {
      await this.globalCounterModel.insertOne({
        code: this.globalCounterCode,
        counter: 100000,
      });
    }
  }

  async generateCode(): Promise<string> {
    const afterUpdate =
      await this.globalCounterModel.findOneAndUpdate<GlobalCounterDocument>(
        { code: { $eq: this.globalCounterCode } },
        { $inc: { counter: 1 } },
        { returnDocument: 'after' },
      );
    return toBase62(afterUpdate?.counter || 1);
  }

  async generateCodes(numberOfCodes: number = 1): Promise<string[] | string> {
    /** @Todo: Generate next code.
     * Action must be atomic to get rid of race-condition.
     */

    if (numberOfCodes <= 0) {
      return [];
    }

    const counterBeforeIncrease = await this.globalCounterModel.findOne({
      code: this.globalCounterCode,
    });

    const afterUpdate =
      await this.globalCounterModel.findOneAndUpdate<GlobalCounterDocument>(
        { code: { $eq: this.globalCounterCode } },
        { $inc: { counter: numberOfCodes } },
        { returnDocument: 'after' },
      );

    const valBeforeUpdate = counterBeforeIncrease?.counter || 1;
    const valAfterUpdate = afterUpdate?.counter || 1;

    return Array(valAfterUpdate - valBeforeUpdate)
      .fill(0)
      .map((_, i) => valBeforeUpdate + i)
      .map(toBase62);
  }
}
