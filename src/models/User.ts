import mongoose, { Schema, type Model } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
  email: string;
  name: string;
  passwordHash: string;
  /** غائب في مستندات قديمة قبل إضافة الحقل */
  role?: UserRole;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
