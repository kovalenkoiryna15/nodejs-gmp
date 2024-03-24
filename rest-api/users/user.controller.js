import { Controllers } from '../constants.js';
import { getPathList, getParsedUrl } from '../utils.js';
import { UsersDb } from './users.db.js';
import querystring from'querystring';

export default class UserController {
  instance;

  route;

  constructor(factory) {
    this.factory = factory;
  }

  setRoute(route) {
    this.route = route;
  }

  handle(req, res) {
    const [, , , , child] = getPathList(req.url, req.headers.host);
    const childRoute = child && this.route.children.find(({ path }) => path === child);

    if (!childRoute) {
      switch (req.method) {
        case 'DELETE':
          this.deleteUser(req, res);
          return;
        default:
          res.statusCode = 404;
          res.end('Not Found');
          return;
      }
    }

    const controller = this.factory.get(`${Controllers.USERS}/:id/${childRoute.path}`);
    controller.setRoute(childRoute);
    controller.handle(req, res);
  }

  deleteUser(req, res) {
    const [, , , id] = getPathList(req.url, req.headers.host);
    
    try {
      UsersDb.deleteUser(id);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");

      res.end(JSON.stringify({
        data: {
          success: true
        },
        error: null,
      }));
    } catch(error) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");

      res.end(JSON.stringify({
        data: null,
        error: error.message,
      }));
    }
  }

  static getInstance(factory) {
    if (!this.instance) {
      this.instance = new UserController(factory);
    }
    return this.instance;
  }
}
