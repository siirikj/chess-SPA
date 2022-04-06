import { Router } from 'express'

import bcrypt from 'bcrypt'

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
	const { username, password } = req.body

	const correctPassword = await db.verifyPassword(username, password)

	console.log(`isCorrectPassword=${correctPassword}`)
})

router.post('/logout', (req, res) => {
	console.log('Användaren vill logga ut')
})

export default { router, requireAuth }
