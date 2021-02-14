import express, { Request, Response, Router, NextFunction } from 'express';
import { NativeError } from 'mongoose';
import authUserService from '../../services/authUserService';
import multer from 'multer';
import UserImageModel, { IUserImage } from '../../models/userImageModel';
import multerConfigService from '../../services/multerConfigService';
import fs from 'fs';

const avatarUploadFolderPath: string = 'uploads/user/avatar/';
const mainUploadFolderPath: string = 'uploads/user/main/';

const avatarUpload = multer({
  storage: multerConfigService(avatarUploadFolderPath),
});
const mainUpload = multer({
  storage: multerConfigService(mainUploadFolderPath),
});

const router: Router = express.Router();

router.get(
  '/images',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = authUserService.authUser(req, res);

      const userImages = await UserImageModel.find(
        { userId: authUser._id },
        (err: NativeError, userImages: IUserImage[]) => {
          if (err) {
            return undefined;
          }

          return userImages;
        }
      );

      res.status(200).json({
        userImages,
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
  '/images/delete',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = authUserService.authUser(req, res);

      const userImages = await UserImageModel.find(
        { userId: authUser._id },
        (err: NativeError, userImages: IUserImage) => {
          if (err) {
            return undefined;
          }

          return userImages;
        }
      );

      res.status(200).json({
        userImages,
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
  '/avatar/upload',
  avatarUpload.single('avatar'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = authUserService.authUser(req, res);
      const files = req.file;

      UserImageModel.findOne({
        userId: user._id,
        type: 'avatar',
      }).exec(async (err: NativeError, userImage: IUserImage) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });

          return;
        }

        if (userImage) {
          fs.unlinkSync(`public/${userImage.url}`);

          await UserImageModel.updateOne(
            {
              userId: user._id,
              type: 'avatar',
            },
            {
              userId: user._id,
              url: `${avatarUploadFolderPath}${files.filename}`,
              type: 'avatar',
              mime: files.mimetype,
              size: files.size,
            }
          );

          const updatedUserImage = UserImageModel.findOne({
            userId: user._id,
            type: 'avatar',
          });

          updatedUserImage.findOne(
            (err: NativeError, userImage: IUserImage) => {
              res.status(200).json({
                success: true,
                data: {
                  newUserImage: userImage,
                  file: files,
                },
              });
            }
          );
        } else {
          const newUserImage = new UserImageModel({
            userId: user._id,
            url: `${avatarUploadFolderPath}${files.filename}`,
            type: 'avatar',
            mime: files.mimetype,
            size: files.size,
          });

          await newUserImage.save();

          res.status(200).json({
            success: true,
            data: {
              newUserImage,
              file: files,
            },
          });
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

router.post(
  '/main/upload',
  mainUpload.single('main'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = authUserService.authUser(req, res);
      const files = req.file;

      UserImageModel.findOne({
        userId: user._id,
        type: 'main',
      }).exec(async (err: NativeError, userImage: IUserImage) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: err,
          });

          return;
        }

        if (userImage) {
          fs.unlinkSync(`public/${userImage.url}`);

          await UserImageModel.updateOne(
            {
              userId: user._id,
              type: 'main',
            },
            {
              userId: user._id,
              url: `${mainUploadFolderPath}${files.filename}`,
              type: 'main',
              mime: files.mimetype,
              size: files.size,
            }
          );

          await UserImageModel.findOne({
            userId: user._id,
            type: 'main',
          }).exec((err: NativeError, userImage: IUserImage) => {
            res.status(200).json({
              success: true,
              data: {
                newUserImage: userImage,
                file: files,
              },
            });
          });
        } else {
          const newUserImage = new UserImageModel({
            userId: user._id,
            url: `${mainUploadFolderPath}${files.filename}`,
            type: 'main',
            mime: files.mimetype,
            size: files.size,
          });

          await newUserImage.save();

          res.status(200).json({
            success: true,
            data: {
              newUserImage,
              file: files,
            },
          });
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

export default router;
