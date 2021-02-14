import { Request, Response, Router, NextFunction } from 'express';
import UserModel, { IUser } from '../../models/userModel';
import UserDetailModel, { IUserDetail } from '../../models/userDetailModel';
import { NativeError } from 'mongoose';
import jwtService from '../../services/jwtService';
import bcryptService from '../../services/bcryptService';
import authUserService from '../../services/authUserService';
import UserImageModel, { IUserImage } from '../../models/userImageModel';

const router: Router = Router();

router.post(
  '/login',
  (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    try {
      UserModel.findOne({
        email: data.email,
        roleName: 'vendor',
      }).exec((err: NativeError, user: IUser) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });

          return;
        }

        if (!user) {
          res.status(403).json({
            success: false,
            error: 'Email and password did not matched',
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
  '/register',
  (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    try {
      UserModel.findOne({
        email: data.email,
      }).exec((err: NativeError, user: IUser) => {
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
          roleName: 'vendor',
          isActive: false,
          isVerified: false,
          registeredAt: Date.now(),
        });

        if (newUser.save()) {
          const newUserDetail = new UserDetailModel({
            userId: newUser._id,
            address: [
              {
                address1: 'N/A',
                address2: 'N/A',
                state: 'N/A',
                country: 'N/A',
                zipCode: 'N/A',
              },
            ],
            contacts: [
              {
                mobileNo: 'N/A',
                telNo: 'N/A',
              },
            ],
            birthDate: 'N/A',
          });

          if (newUserDetail.save()) {
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

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
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
      (err: NativeError, details: IUserDetail) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });
        }

        return details;
      }
    );

    const userImages = await UserImageModel.find(
      { userId: authUser._id },
      (err: NativeError, images: IUserImage[]) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });
        }

        return images;
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
