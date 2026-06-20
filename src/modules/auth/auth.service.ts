import { Body, Injectable } from "@nestjs/common";
import { signupDTO } from "./dto/auth.dto";

@Injectable()
export class AuthService{
    constructor(){}
    signup(@Body()Body:signupDTO){
        return {id:4,username:"assem"}
    }
}