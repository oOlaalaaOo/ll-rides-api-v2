import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description?: string;
}

const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default mongoose.model<IRole>('Role', schema);
