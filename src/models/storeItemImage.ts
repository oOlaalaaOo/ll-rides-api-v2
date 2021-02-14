import mongoose from 'mongoose';
import { IStoreItem } from './storeItemModel';

export interface IStoreItemImage extends mongoose.Document {
  storeItemId: IStoreItem['_id'];
  url: string;
  type: string;
  mime: string;
  size: string;
}

const schema = new mongoose.Schema(
  {
    storeItemId: { type: String, required: true, ref: 'StoreItem' },
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

export default mongoose.model<IStoreItemImage>('StoreItemImage', schema);
