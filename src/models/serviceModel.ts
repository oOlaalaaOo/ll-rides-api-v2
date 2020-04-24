import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface IService extends Document {
  userId: IUser['_id'];
  name?: string;
  description?: string;
  status?: string;
  isPublished?: string;
}

const schema: Schema = new Schema(
  {
    userId: { type: String, required: true, ref: 'User' },
    address1: String,
    address2: String,
    state: String,
    city: String,
    country: String,
    zipCode: String,
    mobileNo: String,
    telNo: String,
    birthDate: Date,
    sex: String,
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default mongoose.model<IService>('Service', schema);
