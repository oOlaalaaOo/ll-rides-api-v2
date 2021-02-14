import UserModel, { IUser } from '../models/userModel';
import UserDetailModel, { IUserDetail } from '../models/userDetailModel';
import UserImageModel, { IUserImage } from '../models/userImageModel';
import { NativeError } from 'mongoose';

const userDetails = async (userId: string) => {
  const user = await UserModel.findOne({
    id: userId,
  }).exec((err: NativeError, user: IUser) => {
    if (err) {
      return undefined;
    }

    return user;
  });

  if (typeof user === 'undefined') {
    return undefined;
  }

  const userDetails = await UserDetailModel.findOne(
    { userId: userId },
    (err: NativeError, userDetails: IUserDetail) => {
      if (err) {
        return undefined;
      }

      return userDetails;
    }
  );

  const userImages = await UserImageModel.find(
    { userId: userId },
    (err: NativeError, userImages: IUserImage[]) => {
      if (err) {
        return undefined;
      }

      return userImages;
    }
  );

  return {
    user,
    userDetails,
    userImages,
  };
};

export default {
  userDetails,
};
