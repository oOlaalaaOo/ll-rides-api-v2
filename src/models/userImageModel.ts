import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface IUserImage extends Document {
  userId: IUser['_id'];
  url?: string;
}

const schema: Schema = new Schema(
  {
    userId: { type: String, required: true, ref: 'UserModel' },
    url: { type: String }
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default mongoose.model<IUserImage>('UserImage', schema);
