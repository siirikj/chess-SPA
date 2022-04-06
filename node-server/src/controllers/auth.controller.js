import { Router } from 'express'

const router = Router()

const requireAuth = (req, res, next) => {
	console.log('Inne i requireAuth')

	next()
}

router.post('/login', async (req, res) => {
	const { name, password } = req.body

	const isCorrectPassword = await db.passwordCheck(name, password)

	console.log(`isCorrectPassword=${isCorrectPassword}`)
})

router.post('/logout', (req, res) => {
	console.log('Användaren vill logga ut')
})

export default { router, requireAuth }
