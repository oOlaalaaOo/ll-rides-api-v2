import mongoose from 'mongoose';
import { IUser } from './userModel';

export interface IUserDetail extends mongoose.Document {
  userId: IUser['_id'];
  description?: string;
  address1?: string;
  address2?: string;
  country?: string;
  zipCode?: string;
  mobileNo?: string;
  telNo?: string;
  birthDate?: Date;
  sex?: string;
}

const schema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: 'User' },
    description: { type: { type: String } },
    address1: { type: String },
    address2: { type: String },
    country: { type: String },
    zipCode: { type: String },
    mobileNo: { type: String },
    telNo: { type: String },
    birthDate: { type: Date },
    sex: { type: String, enum: ['male', 'female'] },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default mongoose.model<IUserDetail>('UserDetail', schema);
