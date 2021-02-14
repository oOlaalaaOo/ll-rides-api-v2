import express, { Request, Response, Router, NextFunction } from 'express';
import UserModel, { IUser } from '../../models/userModel';
import UserDetailModel, { IUserDetail } from '../../models/userDetailModel';
import { NativeError } from 'mongoose';
import jwtService from '../../services/jwtService';
import bcryptService from '../../services/bcryptService';
import authUserService from '../../services/authUserService';
import UserImageModel, { IUserImage } from '../../models/userImageModel';

const router: Router = express.Router();



router.post(
  '/customer/login',
  (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    try {
      UserModel.findOne({
        email: data.email,
        roleName: 'customer',
      }).exec((err: NativeError, user: IUser) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });

          return;
        }

        const password: string = user.password;

        if (!bcryptService.verifyHashString(data.password, password)) {
          res.status(403).json({
            success: false,
            error: 'Email and password did not matched',
          });

          return;
        }

        const jwtPayload = {
          _id: user._id,
          name: user.name,
          email: user.email,
          roleName: user.roleName,
          isActive: user.isActive,
          isVerified: user.isVerified,
          registeredAt: user.registeredAt,
        };

        const accessToken: string = jwtService.signPayload(jwtPayload);

        res.status(200).json({
          success: true,
          data: user,
          accessToken: accessToken,
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

router.post(
  '/customer/register',
  (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    try {
      UserModel.findOne({
        email: data.email,
      }).exec(async (err: NativeError, user: IUser) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });

          return;
        }

        if (user) {
          res.status(403).json({
            success: false,
            error: 'Email already exists',
          });

          return;
        }

        const newUser = new UserModel({
          name: data.name,
          email: data.email,
          password: data.password,
          roleName: 'customer',
          isActive: false,
          isVerified: false,
          registeredAt: Date.now(),
        });

        if (await newUser.save()) {
          const newUserDetail = new UserDetailModel({
            user: newUser._id,
            address: [
              {
                address1: '',
                address2: '',
                state: '',
                country: '',
                zipCode: '',
              },
            ],
            contacts: [
              {
                mobileNo: '',
                telNo: '',
              },
            ],
            birthDate: '',
          });

          if (await newUserDetail.save()) {
            res.status(200).json({
              success: true,
              data: {
                newUser,
                newUserDetail,
              },
            });
          }
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
      });
    }
  }
);

router.get('/user/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = authUserService.authUser(req, res);

    if (!authUser) {
      res.status(500).json({
        success: false,
        error: 'no authUser',
      });
    }

    const user = await UserModel.findOne(
      {
        _id: authUser._id,
      },
      (err: NativeError, user: IUser) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });
        }

        return user;
      }
    );

    const userDetails = await UserDetailModel.findOne(
      { userId: authUser._id },
      (err: NativeError, user: IUserDetail) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });
        }

        return user;
      }
    );

    const userImages = await UserImageModel.find(
      { userId: authUser._id },
      (err: NativeError, users: IUserImage[]) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });
        }

        return users;
      }
    );

    res.status(200).json({
      user,
      userDetails,
      userImages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
});

export default router;
