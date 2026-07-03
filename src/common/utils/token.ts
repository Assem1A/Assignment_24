import { ForbiddenException } from "@nestjs/common";
import { randomUUID } from "crypto";
import jwt, { SignOptions } from 'jsonwebtoken'

export const tokenSign =  (payload: object, secret: string, expiresIn: string): string => {
    const jwtid = randomUUID();
    
    const optional: SignOptions = {
        expiresIn: expiresIn as NonNullable<SignOptions["expiresIn"]>,
        jwtid,
    };
    const token =  jwt.sign(payload, secret, optional)
    return token
}
export const tokenVerify = (authentication: string, secret: string): jwt.JwtPayload => {
    let decoded: jwt.JwtPayload
    try {
        decoded = jwt.verify(authentication, secret as string) as jwt.JwtPayload;


    }
    catch (error) {
        throw new ForbiddenException("Invalid  tokenss type");
    }
    return decoded
}