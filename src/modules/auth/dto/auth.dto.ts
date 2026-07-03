import { IsEmail, IsEnum, IsStrongPassword, MaxLength, MinLength, ValidateIf } from "class-validator";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { isMAtch } from "../../../common/decorators/custom.decorators";
import { GenderEnum } from "../../../enums";
import mongoose from "mongoose";



export interface ILoginDTO extends Iemail{
    FCM:string
    password:string
}
export interface ISignupDTO extends ILoginDTO{
    username:string
    gender:string
}
export interface IConfirmEmailDTO extends Iemail{

    otp:string
}
export interface Iemail{
    email:string
}
export interface IForgetPassword extends ILoginDTO{
otp:string
}


export interface IloginGeneric {
  token: string
  refreshToken:string
}
export interface ISignupGeneric extends IConfirmEmailGeneric {
username:String |undefined
gender:GenderEnum
id:mongoose.Types.ObjectId

}
export interface IConfirmEmailGeneric {
    email:String
}
