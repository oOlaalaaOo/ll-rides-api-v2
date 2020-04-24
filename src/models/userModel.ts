import mongoose, { HookNextFunction } from 'mongoose';
import bcryptService from '../services/bcryptService';
import { validEmail, validAlpha } from '../utils/modelValidatorUtil';
import { IRole } from './roleModel';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
  roleName: IRole['name'];
  registeredAt: Date;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, validate: validAlpha },
    email: { type: String, required: true, validate: validEmail },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    roleName: { type: String, required: true },
    registeredAt: { type: Date, required: true },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

schema.pre<IUser>('save', function (next: HookNextFunction) {
  if (!this.isModified('password')) return next();

  try {
    this.password = bcryptService.hashString(this.password);

    return next();
  } catch (err) {
    return next(err);
  }
});

// schema.methods.verifyPassword = function (
//   plainText: string,
//   callback: Function
// ): boolean {
//   return callback(null, bcrypt.compareSync(plainText, this.password));
// };

export default mongoose.model<IUser>('User', schema);
