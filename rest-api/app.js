import { getPathList } from './utils.js';

export default class App {
  constructor(routes, factory) {
    this.routes = routes;
    this.factory = factory;
  }

  handle(req, res) {
    const [, child] = getPathList(req.url, req.headers.host);
    const childRoute = child && this.routes.find(({ path }) => path === child);

    if (!childRoute) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const controller = this.factory.get(childRoute.path);
    controller.setRoute(childRoute);
    controller.handle(req, res);
  }
}