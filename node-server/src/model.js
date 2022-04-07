import UserSession from './models/userSession.model.js'

class Model {
	constructor() {
		this.chessGames = []
		this.userSessions = []

		this.io = null
	}

	connectUserWithSession(sessionId, username) {
		const userSession = this.userSessions.find(
			(userSession) => userSession.sessionId === sessionId
		)

		userSession.addUserToSession(username)
	}

	disconnectUserWithSession(sessionId, username) {
		const userSession = this.userSessions.find(
			(userSession) => userSession.sessionId === sessionId
		)

		userSession.removeUserFromSession(username)
	}

	addUserSession(sessionId) {
		const userSession = new UserSession(sessionId)
		this.userSessions.push(userSession)
	}

	removeUserSession(sessionId) {
		const tempUserSessions = this.userSessions.filter(
			(userSession) => userSession.sessionId !== sessionId
		)
		this.userSessions = tempUserSessions
	}

	init(io) {
		io.on('connection', (socket) => {
			const { session } = socket.handshake
			session.socketID = socket.id

			console.log(`\nUser with sessionId ${socket.id} connected`)
			this.addUserSession(socket.id)
			console.log(this.userSessions)

			socket.on('disconnect', () => {
				console.log(`\nUser with sessionId ${socket.id} disconnected`)
				this.removeUserSession(socket.id)
				console.log(this.userSessions)
			})

			socket.on('loginUser', (user) => {
				const { username } = user

				console.log(
					`\nUser "${username}" with sessionId "${socket.id}" logged in`
				)
				this.connectUserWithSession(socket.id, username)
				console.log(this.userSessions)
			})

			socket.on('logoutUser', (user) => {
				const { username } = user

				console.log(
					`\nUser "${username}" with sessionId "${socket.id}" logged out`
				)
				this.disconnectUserWithSession(socket.id, username)
				console.log(this.userSessions)
			})

			session.save((err) => {
				if (err) console.error(err)
			})
		})

		this.io = io
	}
}

export default new Model()
