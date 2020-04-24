import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import morgan from 'morgan';
import cors from 'cors';
import socketio from 'socket.io';
import databaseService from './services/databaseService';

const port: number = 5000;

import authRoute from './routes/authRoute';
import roleRoute from './routes/roleRoute';

const app: Express = express();

app.use(morgan('dev'));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

databaseService.connect();

const apiVersion = '/api';

// Routes
app.use(`${apiVersion}/auth`, authRoute);
app.use(`${apiVersion}/role`, roleRoute); // just run once

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
app.set('io', io);

io.on('connection', (socket: socketio.Socket) => {
  console.log('a user is connected');

  socket.emit('testEvent', { data: 'testData' });
});

server.listen(port, () => {
  console.log(`ll-rides api is listening on port ${port}!`);
});
