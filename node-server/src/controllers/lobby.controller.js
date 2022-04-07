import { Router } from 'express'
import model from '../model.js'

const router = Router()

router.get('/chessGames', async (req, res) => {
	try {
		const initChessGames = model.chessGames

		res.json({
			initChessGames,
		})
	} catch (error) {
		console.log(error)
		res.json({
			success: false,
			info: error,
		})
	}
})

export default { router }
