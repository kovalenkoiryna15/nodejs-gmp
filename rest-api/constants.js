export const Controllers = {
  API: 'api',
  USERS: 'users',
  HOBBIES: 'hobbies'
}

export const Routes = [{
  path: Controllers.API,
  children: [{
    path: Controllers.USERS,
    children: [{
      path: ':id',
      children: [{
        path: Controllers.HOBBIES,
      }]
    }]
  }]
}]
