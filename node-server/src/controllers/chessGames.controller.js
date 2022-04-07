import { Router } from 'express'
import model from '../model.js'

const router = Router()

router.get('/chessGames/:chessGameId', async (req, res) => {
	try {
		const { chessGameId } = req.params
		const initChessGameInfo = model.chessGames.find(
			(chessGame) => (chessGame.id = chessGameId)
		)

		res.json({
			initChessGameInfo,
		})
	} catch (error) {
		console.log(error)
		res.json({
			success: false,
			info: error,
		})
	}
})

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
