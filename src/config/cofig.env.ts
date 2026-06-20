import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), 'dev.env') });
export const PORT = process.env.PORT as string ;
export const HASH_ROUND = Number(process.env.HASH_ROUND)  ;
export const JWT_SECRET = process.env.JWT_SECRET ;
export const REFRESH_SECRET = process.env.REFRESH_SECRET ;
export const tokenexpires = process.env.TOKENTIME  ;
export const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES  ;
export const DBLINK = process.env.DBLINK ;
export const REDISLINK = process.env.REDISLINK ;
export const EMAILY=process.env.EMAILY
export const PASSWORDY=process.env.PASSWORDY
export const ENC_KEY = process.env.ENC_KEY;