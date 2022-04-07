import User from './user.model.js'
import { v4 as uuid } from 'uuid'

class ChessGame {
	constructor(username) {
		this.id = uuid()
		this.creator = new User(username)
		this.opponent = null
	}

	addOpponent(username) {
		this.opponent = new User(username)
	}
}

export default ChessGame
