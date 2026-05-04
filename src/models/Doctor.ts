import mongoose, { Schema, type Model } from "mongoose";

export interface IDoctor {
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  bio?: string;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    bio: { type: String },
  },
  { timestamps: true },
);

const Doctor: Model<IDoctor> =
  mongoose.models.Doctor ?? mongoose.model<IDoctor>("Doctor", DoctorSchema);

export default Doctor;
