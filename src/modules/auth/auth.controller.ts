import { Body, Controller, Patch, Post, Req, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { IConfirmEmailDTO, ILoginDTO, ISignupDTO } from "./dto/auth.dto";
import path from "path";
import express from "express";
import type { Request }  from "express";


@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('signup')
    async signup(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true })) body: ISignupDTO) {
        return await this.authService.signup(body)
    }
     @Post('login')
    async login(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  
    body: ILoginDTO, @Req()  req:Request   ) {
        console.log({lang:req.headers["accept-language"]});
        
        return await this.authService.login(body)
    }
    @Patch('confirm-email')
    async confirmEmail(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true })) body: IConfirmEmailDTO){
        return await this.authService.confirmEmail(body)
    }
}