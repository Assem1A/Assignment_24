import { BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { FileFilterCallback,Express } from "multer";


export const fileFilter1=(valdiation1:string[]=[])=>{
    return function(req:Request,file:Express.Multer.File,cb:FileFilterCallback){
        
        if(!valdiation1.includes(file.mimetype)){
            console.log(file.mimetype);
            
            return cb(new BadRequestException("invalid format"))
        }
        return cb(null,true)
    }

}