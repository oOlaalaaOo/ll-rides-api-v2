import mongoose, { HookNextFunction } from 'mongoose';
import bcrypt from 'bcrypt';
import { validEmail, validAlpha } from '../utils/modelValidator';

const SALT_WORK_FACTOR = 10;

export interface IUser extends mongoose.Document {
  name: string;
  usernname: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
  registeredAt: Date;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, validate: validAlpha },
    email: { type: String, required: true, validate: validEmail },
    password: { type: String, required: true, minlength: 5 },
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    // roleId: { type: mongoose.Types.ObjectId, required: true },
    registeredAt: { type: Date, required: true },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

schema.pre<IUser>('save', async function (next: HookNextFunction) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model('User', schema);
