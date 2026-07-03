import { BadRequestException, Body, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IConfirmEmailDTO, IConfirmEmailGeneric, ILoginDTO, IloginGeneric, ISignupDTO, ISignupGeneric } from "./dto/auth.dto";
import { InjectModel } from "@nestjs/mongoose";

import { Model, Types } from "mongoose";
import { User } from "../user/entities/user.entity";
import { Redis } from "../../common/redis/redis.service";
import { IUser } from "../../interfaces";
import { createNumberOtp } from "../../common/utils/otp";
import { HASH_ROUND, JWT_SECRET, REFRESH_SECRET, REFRESH_TOKEN_EXPIRES, tokenexpires } from "../../config/cofig.env";
import { hash,compare } from "bcrypt";
import { sendEmail } from "../../common/utils/sendEmail";
import { funcs } from "../../common/utils/emailTemp";
import { userModel } from "../../DB/models/usermodels";
import { GenderEnum, ProviderEnum } from "../../enums";
import { tokenSign } from "../../common/utils/token";
import { notificationService } from "../../common/utils/notifacation.service";
export const tokenNameInRedis = (message: string, userID: string|Types.ObjectId, jti?: string) => {
  if (jti) {
    return `${message}${userID}${jti}`

  }
  return `${message}${userID}`
}
@Injectable()

export class AuthService {
    constructor(@InjectModel(User.name) private readonly model: Model<IUser>,
       private readonly redis: Redis) { }
   protected generateOtpAndSendEmail = async (email: string) => {
        if (await this.redis.TTL(tokenNameInRedis("UB1", email)) > 0) {
            throw new Error("you are already blocked", { cause: { status: 409 } })
        }
        const cmo = Number(await this.redis.get1(tokenNameInRedis("OTPMax1", email)))
        if (cmo >= 5) {
            await this.redis.set({
                key: tokenNameInRedis("UB1", email),
                val: 0,
                ttl: 300
            })

            throw new Error("you are blocked", { cause: { status: 409 } })
        }
        const code = `${createNumberOtp()}`;
        const hashedCode = await hash(code, HASH_ROUND )
        await this.redis.set({ key: tokenNameInRedis("OTP1", email), val: hashedCode, ttl: 120 })
        cmo > 0 ? await this.redis.inc(tokenNameInRedis("OTPMax1", email)) : await this.redis.set({ key: tokenNameInRedis("OTPMax1", email), val: 1, ttl: 300 })
        await sendEmail(email, "confirm-email",
            funcs(code)
        )
    }
    public login = async (data: ILoginDTO): Promise<IloginGeneric> => {
        const { email, password,FCM } = data;
        const gettings = (Number(await this.redis.get1(tokenNameInRedis("WrongPassword1", email)))) || 0
        const blockedTTL = Number(await this.redis.TTL(tokenNameInRedis("BlockedUser1", email)))
        if (blockedTTL > 0) {
            throw new NotFoundException(`you are blocked for${blockedTTL}`)

        }
        if (gettings >= 4) {
            await this.redis.set({
                key: tokenNameInRedis("BlockedUser1", email),
                val: 1,
                ttl: 300
            })
            await this.redis.delete1(tokenNameInRedis("WrongPassword1", email))
        }
        const user = await this.model.findOne(  { email, provider: ProviderEnum.system, confirmEmail: { $exists: true } })
        if (!user) throw new NotFoundException("invalid email or password")
        const wrongPassword = !(await compare(password, user.password as string))
        if (wrongPassword) {
            gettings > 0 ? await this.redis.inc(tokenNameInRedis("WrongPassword1", email)) : await this.redis.set({ key: tokenNameInRedis("WrongPassword1", email), val: 1, ttl: 300 })
            throw new NotFoundException("invalid email or password")
        }
      if (FCM) {
  await this.redis.set({
    key: `FCM${user._id}`,
    val: FCM,
    ttl: 1000,
  })

  const token = await this.redis.get1(`FCM${user._id}`)

  console.log("FCM token:", token)

  if (token) {
    await notificationService.sendNotifications({
      tokens: [token],
      data: {
        title: "Login",
        body: `new login at ${new Date().toISOString()}`,
      },
    })
  }
}

        const token = tokenSign({ id: user._id, email }, JWT_SECRET as string, tokenexpires as string)
        const refreshToken = tokenSign({ sub: user.id }, REFRESH_SECRET as string, REFRESH_TOKEN_EXPIRES as string)
        await this.redis.delete1(tokenNameInRedis("WrongPassword1", email))
        return { token, refreshToken }


    }
    public signup = async (data: ISignupDTO): Promise<ISignupGeneric> => {
        const { email, password, username, gender } = data;
        const found = await this.model.findOne({ data: { email }, projection: {} })
        if (found) throw new ConflictException("user already exists");

        const genderValue = gender === "female" ? GenderEnum.female : GenderEnum.male;

        const user = await this.model.create({
          username, email, password, provider: ProviderEnum.system, gender: genderValue }
        )
        await this.generateOtpAndSendEmail(email)
        return {
            email: user.email,
            username: user.username,
            gender: user.gender,
            id: user._id
        }
    }
    public confirmEmail = async (data: IConfirmEmailDTO): Promise<string> => {
        const { email, otp } = data
        let user1 = await this.model.findOne( { email, confirmEmail: { $exists: false }, provider: ProviderEnum.system })
        if (!user1) throw new NotFoundException("user1 not found")
        const hasshedOTP = await this.redis.get1(tokenNameInRedis("OTP1", email))
        if (!hasshedOTP) {
            throw new NotFoundException("OTP not found")
        }
        if (!await compare(otp, hasshedOTP)) {
            throw new BadRequestException("OTP is not correct")

        }
        user1.confirmEmail = new Date()
        await user1.save()

        await this.model.updateOne(
          { email },
            { $unset: { verificationExpires: 1 } }
        )

        await this.redis.delete1(tokenNameInRedis("OTP1", email))
        await this.redis.delete1(tokenNameInRedis("UB1", email))
        await this.redis.delete1(tokenNameInRedis("OTPMax1", email))
        return "user confirmed successfully"

    }
    public reSendConfirmEmail = async (data: IConfirmEmailGeneric): Promise<void> => {
        const { email } = data
        let user1 = await this.model.findOne({ data: { email, confirmEmail: { $exists: false }, provider: ProviderEnum.system }, projection: {} })
        if (!user1) throw new NotFoundException("user not found")
        if (await this.redis.TTL(tokenNameInRedis("OTP1", email as string)) > 0) {
            throw new ConflictException("enta aslan m3ak otp")
        }

        await this.generateOtpAndSendEmail(email as string)

    }
}