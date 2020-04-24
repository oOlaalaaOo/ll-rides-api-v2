import express, { Request, Response, Router, NextFunction } from 'express';
import UserModel, { IUser } from '../models/userModel';
import UserDetailModel, { IUserDetail } from '../models/userDetailModel';
import { DocumentQuery, NativeError } from 'mongoose';
import jwtService from '../services/jwtService';
import bcryptService from '../services/bcryptService';
import authUserService from '../services/authUserService';

const router: Router = express.Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;

  try {
    const query: DocumentQuery<any, IUser> = UserModel.findOne({
      email: data.email,
    });

    query.exec((err: NativeError, user: IUser) => {
      const password: string = user.password;

      if (!bcryptService.verifyHashString(data.password, password)) {
        res.status(403).json({
          status: 'fail',
          error: 'Email and password did not matched',
        });

        return;
      }

      const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        isVerified: user.isVerified,
        registeredAt: user.registeredAt,
      };

      const accessToken: string = jwtService.signPayload(jwtPayload);

      res.status(200).json({
        status: 'success',
        data: user,
        accessToken: accessToken,
      });
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: err,
    });
  }
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;

  try {
    const query: DocumentQuery<any, IUser> = UserModel.findOne({
      email: data.email,
    });

    query.exec(async (err: NativeError, user: IUser) => {
      if (user) {
        res.status(403).json({
          status: 'fail',
          error: 'Email already exists',
        });

        return;
      }

      const newUser: IUser = new UserModel({
        name: data.name,
        email: data.email,
        password: data.password,
        isActive: false,
        isVerified: false,
        registeredAt: Date.now(),
      });

      if (await newUser.save()) {
        const newUserDetail: IUserDetail = new UserDetailModel({
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
            status: 'success',
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
      status: 'fail',
      error: err,
    });
  }
});

router.get('/user', (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = authUserService.authUser(req, res);

    res.status(200).json({
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: err,
    });
  }
});

export default router;
