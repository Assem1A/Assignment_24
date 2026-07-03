import { GenderEnum, ProviderEnum } from "../enums"

export interface IUser {
    firstName: String,
    lastName: String,
    username?: string,
    phone?: String,
    profilePicture?: String,
    profileImage?: String | null,
    profileCoverImage?: String | null,
   
    gender: GenderEnum,
    role: number,
    provider: ProviderEnum
    email: String,
    password?: String,
    DOB?: Date,
    CCT?: Date
    confirmEmail?: Date
    deletedAt?: Date
    createdAt?: Date
    updatedAt?: Date



}