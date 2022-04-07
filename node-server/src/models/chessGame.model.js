import User from './user.model.js'
import { v4 as uuid } from 'uuid'
import db from './db.model.js'
import initPiecesLocation from './initChessPieces.js'

class ChessGame {
	constructor(username) {
		this.id = uuid()
		this.creator = new User(username)
		this.opponent = null
		this.state = 'lobby' // "lobby" | "in process" | "finnished"

		this.whitePlayer = null
		this.blackPlayer = null
		this.activeColor = 'white' // "white" | "black"

		this.piecesLocation = initPiecesLocation

		this.winner = null
		this.looser = null
	}

	startGame() {
		const players = [this.creator, this.opponent]

		const startingPlayerIdx = Math.floor(Math.random() * 2)
		this.whitePlayer = players[startingPlayerIdx]
		this.blackPlayer = players[1 - startingPlayerIdx]

		this.state = 'in process'
	}

	checkIfVictory() {
		const currentPlayerIsWhite = this.activeColor === 'white'

		const oponentColor = currentPlayerIsWhite ? 'black' : 'white'
		const didWin = !this.piecesLocation[oponentColor].king.alive

		if (didWin) {
			const winner = currentPlayerIsWhite ? this.whitePlayer : this.blackPlayer

			this.addWinner(winner.username)
		}

		return didWin
	}

	addWinner(username) {
		if (this.creator.username === username) {
			this.winner = this.creator
			this.looser = this.opponent
		} else {
			this.winner = this.opponent
			this.looser = this.creator
		}

		db.addWin(this.winner.username)
		db.addLoss(this.looser.username)

		this.state = 'finnished'
	}

	getUsernameOfOtherPlayer(username) {
		const isCreator = this.creator.username === username
		const usernameOfOtherPlayer = isCreator
			? this.opponent.username
			: this.creator.username

		return usernameOfOtherPlayer
	}

	addOpponent(username) {
		this.opponent = new User(username)
	}
}

export default ChessGame
