import express, { Request, Response, Router, NextFunction } from 'express';
import User from '../models/user';

const router: Router = express.Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  console.log(req);
  res.status(200).json({
    message: 'Handling POST requests to /auth/login',
  });

  next();
});

router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    const data = req.body;

    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
      isActive: false,
      isVerified: false,
      registeredAt: Date.now(),
    };

    const user = new User(userData);

    const resp = await user.save();

    console.log(resp);

    res.status(200).json({
      message: 'Handling POST requests to /auth/register',
    });
  }
);

export default router;
