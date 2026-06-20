import { IsEmail, IsStrongPassword, MaxLength, MinLength, ValidateIf } from "class-validator";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { isMAtch } from "src/common/decorators/custom.decorators";


export class LoginDTO {
    @IsEmail()
    email?: string;
    @IsStrongPassword({minNumbers:3,minLowercase:1,minUppercase:1,minSymbols:1})
    password!: string
}
export class signupDTO extends LoginDTO {
    @MinLength(6)
    @MaxLength(55)


    username!: string;
    @ValidateIf((data:any)=>{
        return Boolean(data.password)
    })
    @isMAtch(['password'],{message:"mismatch"})
    confirmPassword!:string;

}
