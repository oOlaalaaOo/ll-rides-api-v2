import express, { Request, Response, Router, NextFunction } from 'express';
import roleModelSeederService from '../services/roleModelSeederService';

const router: Router = express.Router();

router.post(
  '/seed',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resp = await roleModelSeederService.seedRoles();

      res.status(200).json(resp);
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        error: err,
      });
    }
  }
);

export default router;
