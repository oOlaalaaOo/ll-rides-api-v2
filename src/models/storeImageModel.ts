import mongoose from 'mongoose';
import { IStore } from './storeModel';

export interface IStoreImage extends mongoose.Document {
  storeId: IStore['_id'];
  url: string;
  type: string;
  mime: string;
  size: string;
}

const schema = new mongoose.Schema(
  {
    storeId: { type: String, required: true, ref: 'Store' },
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

export default mongoose.model<IStoreImage>('StoreImage', schema);
