import mongoose from 'mongoose';
import { IUser } from './userModel';

export interface IStore extends mongoose.Document {
  userId: IUser['_id'];
  name: string;
  description: string;
  address: string;
  status: string;
  longitude: string;
  latitude: string;
}

const schema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    status: { type: String, default: 'in-active' },
    longitude: { type: String },
    latitude: { type: String },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default mongoose.model<IStore>('Store', schema);
