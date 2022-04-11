import User from "./user.model.js";

class UserSession {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.user = null;
    this.validUntil = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  }

  addUserToSession(username) {
    this.user = new User(username);
  }

  removeUserFromSession() {
    this.user = null;
  }

  updateValidUntil() {
    this.validUntil = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  }
}

export default UserSession;
