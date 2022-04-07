import { Button } from '@mui/material'
import loggedInUserAtom from '../recoil/loggedInUserAtom'

import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '..'
import { useNavigate } from 'react-router-dom'

const MOCK_CHESS_GAMES = [
	{
		id: '4af7909d-2e3b-4c36-be0b-2448a48d394f',
		creator: {
			id: null,
			username: 'siri',
		},
	},
	{
		id: 'e140ff2a-0883-4ba6-9dfd-ef228a910b45',
		creator: {
			id: null,
			username: 'rasmus',
		},
	},
	{
		id: '639c3c92-8f20-4a78-80cb-cc97ed1050a9',
		creator: {
			id: null,
			username: 'anna',
		},
	},
	{
		creator: {
			id: null,
			username: 'rasmus',
		},
		id: 'e5155a61-e709-44d8-a219-1ee8d4e211a2',
	},
]

const Lobby = ({ socket }) => {
	const navigate = useNavigate()
	const loggedInUser = useRecoilValue(loggedInUserAtom)

	const [chessGames, setChessGames] = useState([])

	useEffect(() => {
		if (socket) {
			socket.on('chessGamesUpdate', (chessGamesUpdate) => {
				const { updatedChessGames } = chessGamesUpdate
				setChessGames(updatedChessGames)
			})

			socket.emit('enteredLobby')
		}

		const fetchChessGames = async () => {
			const res = await axios.get(`${API_BASE_URL}/chessGames`)
			const { initChessGames } = res.data
			setChessGames(initChessGames)
		}

		fetchChessGames()

		return () => {
			if (socket) {
				socket.emit('leftLobby')
			}
		}
	}, [])

	useEffect(() => {
		if (loggedInUser) {
			const gamesThatHaveStarted = chessGames.filter(
				(chessGame) => chessGame.state === 'in process'
			)

			const firstActiveGameForLoggedInUser = gamesThatHaveStarted.find(
				(chessGame) => {
					const isCreator = chessGame.creator.username === loggedInUser.username
					const isOpponent =
						chessGame.opponent.username === loggedInUser.username

					return isCreator || isOpponent
				}
			)

			if (firstActiveGameForLoggedInUser) {
				navigate(`/chessgame/${firstActiveGameForLoggedInUser.id}`)
			}
		}
	}, [chessGames])

	return (
		<div className="w-full flex flex-col items-center">
			<h2>Lobby</h2>
			<div className="w-full shadow-lg bg-white px-10 py-9 flex flex-col gap-y-3 ">
				{chessGames.map((game) => {
					const creatorName =
						loggedInUser && game.creator?.username === loggedInUser?.username
							? 'You'
							: game.creator?.username

					const opponentName =
						loggedInUser && game.opponent?.username === loggedInUser?.username
							? 'You'
							: game.opponent?.username

					const isCreator = creatorName === 'You'

					const opponentExist = opponentName ? true : false

					const gameHasStarted = game.state === 'in process'

					return (
						<div
							key={game.id}
							className="w-full border border-slate-500 px-4 py-3 flex justify-between"
						>
							<div className="flex flex-col flex-[1]">
								<p className="font-semibold">Creator</p>
								<p>{creatorName}</p>
							</div>

							<div className="flex flex-col flex-[1]">
								<p className="font-semibold">Opponent</p>
								<p>{opponentExist ? opponentName : '-'}</p>
							</div>

							<div className="flex">
								{isCreator ? (
									<>
										{opponentExist && !gameHasStarted && (
											<Button
												variant="contained"
												color="success"
												sx={{ width: '85px', ml: '-101px', mr: '16px' }}
												onClick={() => {
													socket.emit('startChessGame', {
														usernameOfCreator: loggedInUser.username,
														chessGameId: game.id,
													})
												}}
											>
												Start
											</Button>
										)}

										{!gameHasStarted && (
											<Button
												variant="contained"
												color="error"
												sx={{ width: '85px' }}
												onClick={() => {
													socket.emit('removeChessGame', {
														usernameOfRemover: loggedInUser.username,
														chessGameId: game.id,
													})
												}}
											>
												Delete
											</Button>
										)}
									</>
								) : opponentExist ? (
									<div className="w-[85px]" />
								) : (
									<Button
										variant="contained"
										sx={{ width: '85px' }}
										onClick={() => {
											socket.emit('joinChessGame', {
												usernameOfOpponent: loggedInUser.username,
												chessGameId: game.id,
											})
										}}
									>
										{loggedInUser ? 'Join' : 'Observe'}
									</Button>
								)}
							</div>
						</div>
					)
				})}

				{loggedInUser && (
					<Button
						variant="contained"
						sx={{ mt: 1, py: 1.5 }}
						onClick={() => {
							socket.emit('createChessGame', {
								username: loggedInUser.username,
							})
						}}
					>
						Create new game
					</Button>
				)}
			</div>
		</div>
	)
}

export default Lobby
