import mongoose from 'mongoose';
import { IStore } from './storeModel';

export interface IStoreItem extends mongoose.Document {
  storeId: IStore['_id'];
  name: string;
  description: string;
  status: string;
}

const schema = new mongoose.Schema(
  {
    storeId: { type: String, required: true, ref: 'Store' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'in-active' },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default mongoose.model<IStoreItem>('StoreItem', schema);
