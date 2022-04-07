import User from './user.model.js'

class UserSession {
	constructor(sessionId) {
		this.sessionId = sessionId
		this.user = null
	}

	addUserToSession(username) {
		this.user = new User(username)
	}

	removeUserFromSession() {
		this.user = null
	}
}

export default UserSession
