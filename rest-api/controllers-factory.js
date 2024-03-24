import { Controllers } from './constants.js';
import ApiController from './api/api.controller.js';
import UsersController from './users/users.controller.js';
import UserController from './users/user.controller.js';
import HobbiesController from './hobbies/hobbies.controller.js';

export default class ControllersFactory {
  static get(key) {
    switch (key) {
      case Controllers.API:
        return ApiController.getInstance(this);
      case Controllers.USERS:
        return UsersController.getInstance(this);
      case `${Controllers.USERS}/:id`:
        return UserController.getInstance(this);
      case `${Controllers.USERS}/:id/${Controllers.HOBBIES}`:
        return HobbiesController.getInstance(this);
      default:
        throw Error(`Controller for path "${key}" does not exist.`)
    }
  }
}