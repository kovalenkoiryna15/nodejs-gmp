import { getPathList } from '../utils.js';

export default class ApiController {
  instance;

  route;

  constructor(factory) {
    this.factory = factory;
  }

  setRoute(route) {
    this.route = route;
  }

  handle(req, res) {
    const [, , child] = getPathList(req.url, req.headers.host);
    const childRoute = child && this.route.children.find(({ path }) => path === child);

    if (!childRoute) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const controller = this.factory.get(childRoute.path);
    controller.setRoute(childRoute);
    controller.handle(req, res);
  }

  static getInstance(factory) {
    if (!this.instance) {
      this.instance = new ApiController(factory); 
    }
    return this.instance;
  }
}
