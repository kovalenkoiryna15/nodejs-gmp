import http from 'http';
import App from './app.js';
import { Routes } from './constants.js';
import ControllersFactory from './controllers-factory.js';

const app = new App(Routes, ControllersFactory);

const server = http.createServer((req, res) => {
  app.handle(req, res);
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});

server.on('error', (err) => {
  console.error(err);
});
