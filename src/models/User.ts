import mongoose, { Schema, type Model } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  passwordHash: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
