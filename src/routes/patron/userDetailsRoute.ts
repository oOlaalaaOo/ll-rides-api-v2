import express, { Request, Response, Router, NextFunction } from 'express';
import UserModel, { IUser } from '../../models/userModel';
import UserDetailModel, { IUserDetail } from '../../models/userDetailModel';
import { NativeError } from 'mongoose';
// import jwtService from '../services/jwtService';
// import bcryptService from '../services/bcryptService';
import authUserService from '../../services/authUserService';
import userImageModel, { IUserImage } from '../../models/userImageModel';

const router: Router = express.Router();

router.post(
  '/update',
  async (req: Request, res: Response, next: NextFunction) => {
    const user = authUserService.authUser(req, res);

    const data = req.body;

    try {
      UserDetailModel.findOne({
        userId: user._id,
      }).exec(async (err: NativeError, userDetails: IUserDetail) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });

          return;
        }

        await UserModel.updateOne(
          {
            _id: user._id,
          },
          {
            name: data.name,
          }
        );

        await UserDetailModel.updateOne(
          {
            userId: user._id,
          },
          {
            description: data.description,
            address1: data.address1,
            address2: data.address2,
            country: data.country,
            zipCode: data.zipCode,
            mobileNo: data.mobileNo,
            telNo: data.telNo,
            birthDate: data.birthDate,
            sex: data.sex,
          }
        );

        const newUser = await UserModel.findOne(
          {
            _id: user._id,
          },
          (err: NativeError, user: IUser) => {
            if (err) {
              return undefined;
            }

            return user;
          }
        );

        const userImages = await userImageModel.find(
          { userId: user._id },
          (err: NativeError, userImages: IUserImage[]) => {
            if (err) {
              return undefined;
            }

            return userImages;
          }
        );

        res.status(200).json({
          success: true,
          data: {
            user: newUser,
            userDetails: userDetails,
            userImages: userImages
          },
        });
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
      });
    }
  }
);

export default router;
