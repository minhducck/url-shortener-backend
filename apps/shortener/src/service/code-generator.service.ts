import {Injectable} from "@nestjs/common";

@Injectable()
export class CodeGeneratorService {
  async generateCode(): Promise<string> {
    /** @Todo: Generate next code.
     * Action must be atomic to get rid of race-condition.
     */

    return "ABC";
  }
}