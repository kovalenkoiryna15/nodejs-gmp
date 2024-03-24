import { UsersDb } from '../users/users.db.js';

export class HobbiesDb {
  static _hobbies = {};

  static getHobbies(userId) {
    try {
      const { user } = UsersDb.getUser(userId);

      if (!HobbiesDb._hobbies[user.id]) {
        HobbiesDb.createEmptyHobbies(user.id);
      }
      return HobbiesDb._hobbies[user.id];
    } catch (err) {
      throw err;
    }
  }

  static createEmptyHobbies(id) {
    HobbiesDb._hobbies[id] = {
      hobbies: [],
      links: {
        self: `/api/users/${id}/hobbies`,
        user: `/api/users/${id}`,
      }
    }
  }

  static updateHobbies(userId, newHobbies) {
    try {
      const data = UsersDb.getUser(userId);
      const { user } = data;

      if (!HobbiesDb._hobbies[user.id]) {
        HobbiesDb.createEmptyHobbies(user.id);
      }

      HobbiesDb._hobbies[user.id].hobbies = [...new Set([...HobbiesDb._hobbies[user.id].hobbies, ...newHobbies])];
      return data;
    } catch (err) {
      throw err;
    }
  }

  static deleteHobbies(userId) {
    if (HobbiesDb._hobbies[userId]) {
      delete HobbiesDb._hobbies[userId];
    }
  }
}
