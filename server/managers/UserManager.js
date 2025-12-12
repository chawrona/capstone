import UserDoesNotExistError from "../errors/UserDoesNotExistError.js";
import User from "../models/User.js";

export default class UserManager {
  constructor() {
    if (UserManager.instance) {
      return UserManager.instance;
    }
    UserManager.instance = this;
    this.users = new Map();
    this.userIdToSocketId = new Map();
    this.publicIdToId = new Map();
    this.userIdToTimeoutId = new Map();
  }

  createUser(userId, socketId, username) {
    const user = new User(userId, username);
    this.users.set(userId, user);
    this.publicIdToId.set(user.publicId, userId);
    this.updateUserSocketId(userId, socketId);
  }

  createTimeout(userId, timeoutId) {
    this.userIdToTimeoutId.set(userId, timeoutId);
  }

  updateUserSocketId(userId, socketId) {
    this.userIdToSocketId.set(userId, socketId);
  }

  getUser(userId) {
    const user = this.users.get(userId);
    if (!user) {
      throw new UserDoesNotExistError();
    }
    return user;
  }

  getUserByPublicId(publicId) {
    const userId = this.publicIdToId.get(publicId);
    if (!userId) {
      throw new UserDoesNotExistError();
    }
    const user = this.users.get(userId);
    if (!user) {
      throw new UserDoesNotExistError();
    }
    return user;
  }

  getUserIdByPublicId(publicId) {
    return this.publicIdToId.get(publicId);
  }

  getUserSocketId(userId) {
    return this.userIdToSocketId.get(userId);
  }

  doesUserExist(userId) {
    return this.users.has(userId);
  }

  hasTimeout(userId) {
    return this.userIdToTimeoutId.has(userId);
  }

  clearTimeout(userId) {
    clearTimeout(this.userIdToTimeoutId.get(userId));
    this.userIdToTimeoutId.delete(userId);
  }

  deleteUser(userId) {
    const user = this.users.get(userId);
    if (user) {
      this.publicIdToId.delete(user.publicId);
    }
    this.userIdToSocketId.delete(userId);
    this.users.delete(userId);
    this.clearTimeout(userId);
  }
}
