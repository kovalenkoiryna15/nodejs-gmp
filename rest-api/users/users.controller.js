import { Controllers } from '../constants.js';
import { getPathList } from '../utils.js';
import { UsersDb } from './users.db.js';

export default class UsersController {
  instance;

  route;

  constructor(factory) {
    this.factory = factory;
  }

  setRoute(route) {
    this.route = route;
  }

  handle(req, res) {
    const [, , , id] = getPathList(req.url, req.headers.host);

    if (!id) {
      switch (req.method) {
        case 'GET':
          this.getUsers(req, res);
          return;
        case 'POST':
          this.createUser(req, res);
          return;
        default:
          res.statusCode = 404;
          res.end('Not Found');
          return;
      }
    }

    const controller = this.factory.get(`${Controllers.USERS}/:id`);
    controller.setRoute(this.route.children.find(({ path }) => path === ':id'));
    controller.handle(req, res);
  }

  getUsers(req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.end(JSON.stringify({
      data: UsersDb.getUsers(),
      error: null,
    }));
  }

  createUser(req, res) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const { name, email } = JSON.parse(body);
      const user = UsersDb.createUser(name, email);
  
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
  
      res.end(JSON.stringify({
        data: user,
        error: null,
      }));
    });
  }

  static getInstance(factory) {
    if (!this.instance) {
      this.instance = new UsersController(factory);
    }
    return this.instance;
  }
}
