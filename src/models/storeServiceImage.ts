import mongoose from 'mongoose';
import { IStoreService } from './storeServiceModel';

export interface IStoreServiceImage extends mongoose.Document {
  storeServiceId: IStoreService['_id'];
  url: string;
  type: string;
  mime: string;
  size: string;
}

const schema = new mongoose.Schema(
  {
    storeServiceId: { type: String, required: true, ref: 'StoreService' },
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

export default mongoose.model<IStoreServiceImage>('StoreServiceImage', schema);
