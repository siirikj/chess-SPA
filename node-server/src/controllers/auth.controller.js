import { Router } from 'express'
import model from '../model.js'

import db from '../models/db.model.js'

const router = Router()

const requireAuth = (req, res, next) => {
	console.log('Inne i requireAuth')

	next()
}

router.post('/register', async (req, res) => {
	try {
		console.log(req.body)
		const { username, password } = req.body

		console.log(username, password)

		const [success, info] = await db.addUser(username, password)

		res.json({
			success,
			info,
		})
	} catch (error) {
		console.log(error)
		res.json({
			success: false,
			info: error,
		})
	}
})

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body

		const correctPassword = await db.verifyPassword(username, password)

		res.json({
			correctPassword,
			username,
		})
	} catch (error) {
		console.log(error)
		res.json({
			success: false,
			info: error,
		})
	}
})

export default { router, requireAuth }
