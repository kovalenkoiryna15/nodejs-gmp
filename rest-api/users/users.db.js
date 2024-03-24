import crypto from 'crypto';
import { HobbiesDb } from '../hobbies/hobbies.db.js';

export class UsersDb {
  static _users = [
    {
      user: {
        id: "5f3b4b29-03dd-4ed9-84a3-6dfcfz4c2be98",
        name: "John Doe",
        email: "johndoe@example.com"
      },
      links: {
        self: "/api/users/5f3b4b29-03dd-4ed9-84a3-6dfcfz4c2be98",
        hobbies: "/api/users/5f3b4b29-03dd-4ed9-84a3-6dfcfz4c2be98/hobbies"
      }
    }
  ];

  static getUsers() {
    return UsersDb._users;
  }

  static createUser(name, email) {
    const id = crypto.randomUUID();
    const user = {
      user: {
        id,
        name,
        email,
      },
      links: {
        self: `/api/users/${id}`,
        hobbies: `/api/users/${id}/hobbies`,
      }
    };
    UsersDb._users.push(user);
    return user;
  }

  static deleteUser(id) {
    const index = UsersDb._users.findIndex(({ user }) => user.id === id);

    if (index >= 0) {
      UsersDb._users.splice(index, 1);
      HobbiesDb.deleteHobbies(id);
      return;
    }

    throw new Error(`User with id "${id}" doesn't exist.`);
  }

  static getUser(id) {
    const data = UsersDb._users.find(({ user }) => user.id === id);

    if (!data) {
      throw new Error(`User with id "${id}" doesn't exist.`);
    }

    return data;
  }
}
