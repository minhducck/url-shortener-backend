import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class GlobalCounterModel {
  @Prop({ unique: true, default: 'GLOBAL_COUNTER' })
  code: string;

  @Prop({ default: 0 })
  counter: number;
}

export type GlobalCounterDocument = HydratedDocument<GlobalCounterModel>;

export const GlobalCounterSchema =
  SchemaFactory.createForClass(GlobalCounterModel);
export const GlobalCounterDefinition: ModelDefinition = {
  name: 'global-counter',
  schema: GlobalCounterSchema,
};
