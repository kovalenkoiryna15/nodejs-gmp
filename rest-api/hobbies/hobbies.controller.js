import { getPathList } from '../utils.js';
import { HobbiesDb } from './hobbies.db.js';

export default class HobbiesController {
  instance;

  route;

  constructor(factory) {
    this.factory = factory;
  }

  setRoute(route) {
    this.route = route;
  }

  handle(req, res) {
    const [, , , , , child] = getPathList(req.url, req.headers.host);
    const childRoute = child && this.route.children.find(({ path }) => path === child);

    if (!childRoute) {
      switch (req.method) {
        case 'GET':
          this.getHobbies(req, res);
          return;
        case 'PATCH':
          this.updateHobbies(req, res);
          return;
        default:
          res.statusCode = 404;
          res.end('Not Found');
          return;
      }
    }

    const controller = this.factory.get(childRoute.path);
    controller.setRoute(childRoute);
    controller.handle(req, res);
  }

  getHobbies(req, res) {
    try {
      const [, , , id] = getPathList(req.url, req.headers.host);
      const data = HobbiesDb.getHobbies(id);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.end(JSON.stringify({
        data,
        error: null,
      }));
    } catch (error) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        data: null,
        error: error.message,
      }));
    }
  }

  updateHobbies(req, res) {
    const [, , , id] = getPathList(req.url, req.headers.host);
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const { hobbies } = JSON.parse(body);
        const user = HobbiesDb.updateHobbies(id, hobbies);

        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");

        res.end(JSON.stringify({
          data: user,
          error: null,
        }));
      } catch (error) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          data: null,
          error: error.message,
        }));
      }
    });
  }

  static getInstance(factory) {
    if (!this.instance) {
      this.instance = new HobbiesController(factory);
    }
    return this.instance;
  }
}
