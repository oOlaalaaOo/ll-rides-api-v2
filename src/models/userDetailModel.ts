import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface IUserDetail extends Document {
  userId: IUser['_id'];
  address1?: string;
  address2?: string;
  state?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  mobileNo?: string;
  telNo?: string;
  birthDate?: Date;
  sex?: string;
}

const schema: Schema = new Schema(
  {
    userId: { type: String, required: true, ref: 'UserModel' },
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

export default mongoose.model<IUserDetail>('UserDetail', schema);
