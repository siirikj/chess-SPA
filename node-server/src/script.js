import db from './models/db.model.js'

const addUsers = async () => {
	const [success1, info1] = await db.addUser('rasmus', 'hej123')
	const [success2, info2] = await db.addUser('siri', 'hej123')

	console.log(success1, info1)
	console.log(success2, info2)
}

const addGames = async () => {
	// const [success1, info1] = await db.addGame('rasmus')
	// console.log(success1, info1)
	const [success2, info2] = await db.addGame('siri')
	console.log(success2, info2)
}

const main = () => {
	// addUsers()
	addGames()
}

main()
