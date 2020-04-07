import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import morgan from 'morgan';
import cors from 'cors';
import socketio from 'socket.io';
import mongoose from 'mongoose';

const port: number = 5000;

import auth from './routes/auth';

mongoose.connect('mongodb://localhost:27017/ll-rides-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app: Express = express();

app.use(morgan('dev'));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

const apiVersion = '/api';

// Routes
app.use(`${apiVersion}/auth`, auth);

app.use((req: Request, res: Response, next: NextFunction) => {
  let error: any = new Error('Not Found');
  error.status = 404;

  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const server: http.Server = http.createServer(app);
const io: socketio.Server = socketio(server);

io.on('connection', (socket: any) => {
  console.log('a user connected', socket);
});

app.set('io', io);

server.listen(port, () => {
  console.log(`ll-rides api is listening on port ${port}!`);
});
