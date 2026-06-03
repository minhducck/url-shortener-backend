import { Snowflake } from '@sapphire/snowflake';

export const generateULID = (): bigint => {
  const datetime = Date.now();
  const snowflake = new Snowflake(datetime);

  return snowflake.generate();
};
