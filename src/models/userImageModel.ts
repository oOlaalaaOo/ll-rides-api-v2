import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface IUserImage extends Document {
  userId: IUser['_id'];
  url: string;
  type: string;
}

const schema: Schema = new Schema(
  {
    userId: { type: String, required: true, ref: 'User' },
    url: { type: String },
    type: { type: String },
    mime: { type: String },
    size: { type: String },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default mongoose.model<IUserImage>('UserImage', schema);
