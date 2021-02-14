import http from 'http';
import app from './app';
import socketIOService from './services/socketIOService';
import databaseService from './services/databaseService';
import config from './config';

const port: any = config.portNumber;

const server = http.createServer(app);
databaseService.connect();
const io = socketIOService(server);

app.set('io', io);

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
