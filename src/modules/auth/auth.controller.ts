import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {  signupDTO } from "./dto/auth.dto";

@Controller("auth")
export class AuthController{
    constructor(private readonly authService:AuthService){}
    @Post('signup')
    signup(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,stopAtFirstError:true}))Body:signupDTO){
    return   this.authService.signup(Body
    )
    }
}