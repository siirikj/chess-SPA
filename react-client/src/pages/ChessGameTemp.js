import { Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { API_BASE_URL } from '..'
import loggedInUserAtom from '../recoil/loggedInUserAtom'

const ChessGameTemp = ({ socket }) => {
	const params = useParams()
	const loggedInUser = useRecoilValue(loggedInUserAtom)

	const [gameInfo, setGameInfo] = useState(null)

	useEffect(() => {
		const fetchChessGameInfo = async () => {
			const res = await axios.get(
				`${API_BASE_URL}/chessGames/${params.chessGameId}`
			)
			const { initChessGameInfo } = res.data
			setGameInfo(initChessGameInfo)
		}

		fetchChessGameInfo()

		socket.on('chessGameInfoUpdate', (args) => {
			const { updatedChessGameInfo } = args
			setGameInfo(updatedChessGameInfo)
		})

		// io.to(`chessRoom#${chessGameId}`).emit('chessGameInfoUpdate', {
		//   updatedChessGameInfo: finalChessGameInfo,
		// })

		socket.emit('enteredGame', { chessGameId: params.chessGameId })

		return () => socket.emit('leftGame', { chessGameId: params.chessGameId })
	}, [])

	if (!gameInfo) return <CircularProgress size={60} />

	const isCreator = gameInfo.creator.username === loggedInUser?.username
	const isOpponent = gameInfo.opponent.username === loggedInUser?.username

	const isPlayer = isCreator || isOpponent

	let currentPlayerInfo = null

	if (isPlayer) {
		const username = loggedInUser.username
		const color =
			gameInfo.whitePlayer.username === loggedInUser.username
				? 'white'
				: 'black'
		const isActivePlayer = gameInfo.activeColor === color
		const wonGame = gameInfo.winner?.username === username

		currentPlayerInfo = {
			username,
			color,
			isActivePlayer,
			wonGame,
		}
	}

	return (
		<div>
			<p>A chess game</p>
			{isPlayer && (
				<div className="flex gap-x-3">
					<Button variant="contained" onClick={() => {}}>
						Make move
					</Button>

					<Button
						color="error"
						variant="contained"
						onClick={() => {
							socket.emit('surrender', { chessGameId: params.chessGameId })
						}}
					>
						Surrender
					</Button>
				</div>
			)}

			<pre>{JSON.stringify(gameInfo, null, 2)}</pre>

			<p className="font-bold mt-3">Player info</p>
			<pre>{JSON.stringify(currentPlayerInfo, null, 2)}</pre>
		</div>
	)
}

export default ChessGameTemp
