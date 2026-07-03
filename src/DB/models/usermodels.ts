export const users = []

import mongoose, { models, HydratedDocument, Model, Mongoose } from "mongoose";
import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose'
import { createCascadeDeleteHook, createParanoidDeleteHook, createParanoidFindHook } from "./cascade";
import { hash } from "bcrypt";
import { IUser } from "../../interfaces";
import { GenderEnum, ProviderEnum } from "../../enums";
import { generateEncryption } from "../../common/utils/security";
import { HASH_ROUND } from "../../config/cofig.env";
export type HUserDocument = HydratedDocument<IUser>
@Schema({
    collection: "Users",
    selectPopulatedPaths: false,
    timestamps: true,
    strict: false,
    strictQuery: false,
    virtuals: true,
})
export class User implements IUser {
    @Prop({ type: String, required: true })
    firstName!: string;
    @Prop({ type: String, required: true })

    lastName!: string;

    @Virtual({
        set: function (this: HUserDocument, value: string) {
            const [firstName = "", lastName = ""] = value.split(" ") || [];
            this.firstName = firstName;
            this.lastName = lastName;
        }, get: function (this: HUserDocument) {
            return `${this.firstName} ${this.lastName}`;
        }
    })
    username?: string | undefined;
    @Prop({ type: String })
    phone?: string;
    @Prop({ type: String })
    profilePicture?: string;
    @Prop({ type: String, default: null })
    profileImage?: string;
    @Prop({ type: String, default: null })
    profileCoverImage?: string;
    @Prop({ type: Number, enum: GenderEnum, default: GenderEnum.male })
    gender!: GenderEnum;
    @Prop({ type: Number, default: 1 })
    role!: number;
    @Prop({ type: Number, enum: ProviderEnum, default: 0 })
    provider!: number;
    @Prop({ type: String, required: true, unique: true })
    email!: string;
    @Prop({
        type: String,
        required: function (this: HydratedDocument<IUser>) {
            return this.provider === 0
        }
    })
    password?: string

    @Prop({ type: Date })
    DOB?: Date;
    @Prop({ type: Date })

    CCT?: Date;
    @Prop({ type: Date })

    confirmEmail?: Date;
    @Prop({ type: Date, default: null })

    deletedAt?: Date;

};


export const userSchema = SchemaFactory.createForClass(User)
export const userModel = MongooseModule.forFeatureAsync([{
    name: User.name,
    useFactory: () => {
     
        const applyParanoid = createParanoidFindHook();
        const applyParanoidDelete = createParanoidDeleteHook();
        const cascadeDeleteUserPosts = createCascadeDeleteHook("posts", "author");
        const cascadeDeleteUserComments = createCascadeDeleteHook("Comment", "author");

        userSchema.pre("find", applyParanoid);
        userSchema.pre("findOne", applyParanoid);
        userSchema.pre("findOneAndUpdate", applyParanoid);
        userSchema.pre("countDocuments", applyParanoid);

        userSchema.pre("deleteOne", { query: true, document: false }, cascadeDeleteUserPosts);
        userSchema.pre("deleteOne", { query: true, document: false }, cascadeDeleteUserComments);
        userSchema.pre("deleteOne", { query: true, document: false }, applyParanoidDelete);
        userSchema.pre("deleteMany", { query: true, document: false }, cascadeDeleteUserPosts);
        userSchema.pre("deleteMany", { query: true, document: false }, cascadeDeleteUserComments);
        userSchema.pre("deleteMany", { query: true, document: false }, applyParanoidDelete);
  


        userSchema.pre("save", async function (this: HydratedDocument<IUser>) {
            if (this.isModified("password") && this.password) {
                this.password = await hash(this.password as string,HASH_ROUND);
            }

            if (this.isModified("phone") && this.phone) {
                this.phone = await generateEncryption(this.phone as string);
            }
        });

        return userSchema
    }
}])
