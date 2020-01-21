import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

type ParseEntityOptions = {
  validatorOptions: ValidatorOptions;
};

@Injectable()
export class ParseEntityPipe implements PipeTransform {
  private options: ParseEntityOptions = {
    validatorOptions: {
      whitelist: true
    }
  };

  constructor(private parseEntityOptions?: ParseEntityOptions) {
    Object.assign({}, this.options, this.parseEntityOptions);
  }

  public async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const entity = plainToClass(metatype, value);
    // Pass only a copy to validate to avoid mutating the real object
    const errors = await validate({ ...entity }, this.options.validatorOptions);

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return entity;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
