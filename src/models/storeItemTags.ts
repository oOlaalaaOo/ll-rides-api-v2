import mongoose from 'mongoose';
import { IStoreItem } from './storeItemModel';

export interface IStoreItemTag extends mongoose.Document {
  storeItemId: IStoreItem['_id'];
  name: string;
  description?: string;
}

const schema = new mongoose.Schema(
  {
    storeItemId: { type: String, required: true, ref: 'StoreItem' },
    name: { type: String, required: true },
    description: { type: String },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default mongoose.model<IStoreItemTag>('StoreItemTag', schema);
