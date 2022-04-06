import db from '../database.js'
import { v4 as uuid } from 'uuid'

const DataBase = {
	async addUser(username, password) {
		try {
			const UserID = uuid()

			await db.run(
				'INSERT INTO Users (UserID, Username, Password) VALUES (?, ?, ?)',
				[UserID, username, password]
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
