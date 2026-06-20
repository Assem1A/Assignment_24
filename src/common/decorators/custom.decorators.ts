import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export function isMAtch<T=any>(constraints:string[]=[],validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: matchbetweenfields<T>,
    });
  };
}

@ValidatorConstraint({ name: 'matchbetweenfields', async: false })
export class matchbetweenfields<T=any> implements ValidatorConstraintInterface {
  validate(value: T, args: ValidationArguments) {
    return value==args.object[args.constraints[0]]; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    return 'Text ($value) is too short or too long!';
  }
}