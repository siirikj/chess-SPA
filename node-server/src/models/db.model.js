import db from '../database.js'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

const DataBase = {
	async addUser(username, password) {
		try {
			const UserID = uuid()

			const hashedPassword = await new Promise((resolve, reject) => {
				bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
					if (err) reject(err)
					resolve(hash)
				})
			})

			console.log(hashedPassword)

			await db.run(
				'INSERT INTO Users (UserID, Username, Password) VALUES (?, ?, ?)',
				[UserID, username, hashedPassword]
			)

			return [
				true,
				{
					username,
					password,
				},
			]
		} catch (error) {
			return [false, error]
		}
	},
	async verifyPassword(username, password) {
		const user = (
			await db.all('SELECT Password FROM Users WHERE Username=(?)', [username])
		)[0]

		const hasedPassword = user.Password

		const correctPassword = await bcrypt.compare(password, hasedPassword)

		return correctPassword
	},
	async getUserInfo(username) {
		const userInfo = (
			await db.all(
				'SELECT GamesWon, GamesLost, GamesPlayed FROM Users WHERE Username=(?)',
				[username]
			)
		)[0]

		return [true, userInfo]
	},
	async addWin(username) {
		const user = (
			await db.all(
				'SELECT UserID, GamesWon, GamesPlayed FROM Users WHERE Username=(?)',
				[username]
			)
		)[0]

		const { UserID, GamesWon, GamesPlayed } = user

		const newGamesWon = GamesWon + 1
		const newGamesPlayed = GamesPlayed + 1

		await db.run(
			'UPDATE Users SET GamesWon=(?), GamesPlayed=(?) WHERE UserID=(?)',
			[newGamesWon, newGamesPlayed, UserID]
		)
	},
	async addLoss(username) {
		const user = (
			await db.all(
				'SELECT UserID, GamesLost, GamesPlayed FROM Users WHERE Username=(?)',
				[username]
			)
		)[0]

		const { UserID, GamesLost, GamesPlayed } = user

		const newGamesLost = GamesLost + 1
		const newGamesPlayed = GamesPlayed + 1

		await db.run(
			'UPDATE Users SET GamesLost=(?), GamesPlayed=(?) WHERE UserID=(?)',
			[newGamesLost, newGamesPlayed, UserID]
		)
	},
	async addGame(username) {
		try {
			const creator = (
				await db.all('SELECT UserID FROM Users WHERE Username=(?)', [username])
			)[0]

			const CreatorID = creator.UserID
			const GameID = uuid()

			await db.run('INSERT INTO Games (GameID, CreatorID) VALUES (?, ?)', [
				GameID,
				CreatorID,
			])

			return [
				true,
				{
					GameID,
					CreatorID,
				},
			]
		} catch (error) {
			return [false, error]
		}
	},
}

export default DataBase
