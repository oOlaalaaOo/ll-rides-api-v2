import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import loggerService from './services/loggerService';

import roleRoute from './routes/roleRoute';
import vendorAuthRoute from './routes/vendor/authRoute';
import vendorUserImageRoute from './routes/vendor/userImageRoute';
import vendorUserDetailsRoute from './routes/vendor/userDetailsRoute';

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(compression());

const apiVersion = '/api';

// Routes
app.use(`${apiVersion}/role`, roleRoute); // just run once

app.use(`${apiVersion}/vendor/auth`, vendorAuthRoute);
app.use(`${apiVersion}/vendor/image`, vendorUserImageRoute);
app.use(`${apiVersion}/vendor/details`, vendorUserDetailsRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  let error: any = new Error('Not Found');
  error.status = 404;

  loggerService.error(JSON.stringify(error));
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  loggerService.error(JSON.stringify(error));

  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
