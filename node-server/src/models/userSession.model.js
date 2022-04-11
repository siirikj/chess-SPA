import User from './user.model.js'

const VALID_TIME = 40 * 1000 // 24 * 60 * 60 * 1000

class UserSession {
	constructor(sessionId) {
		this.sessionId = sessionId
		this.user = null
		this.validUntil = new Date(new Date().getTime() + VALID_TIME)
	}

	addUserToSession(username) {
		this.user = new User(username)
	}

	removeUserFromSession() {
		this.user = null
	}

	updateValidUntil() {
		this.validUntil = new Date(new Date().getTime() + VALID_TIME)
	}
}

export default UserSession
