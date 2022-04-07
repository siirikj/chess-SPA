import { Button } from '@mui/material'
import loggedInUserAtom from '../recoil/loggedInUserAtom'

import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '..'

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
	const loggedInUser = useRecoilValue(loggedInUserAtom)

	const [chessGames, setChessGames] = useState([])

	useEffect(() => {
		const fetchChessGames = async () => {
			const res = await axios.get(`${API_BASE_URL}/chessGames`)
			const { initChessGames } = res.data
			setChessGames(initChessGames)
		}

		fetchChessGames()
	}, [])

	return (
		<div className="w-full flex flex-col items-center">
			<h2>Lobby</h2>
			<div className="w-full shadow-lg bg-white px-10 py-9 flex flex-col gap-y-3 ">
				{chessGames.map((game) => (
					<div
						key={game.id}
						className="w-full border border-slate-500 px-4 py-3 flex justify-between"
					>
						<div className="flex flex-col flex-[1]">
							<p className="font-semibold">Skapare</p>
							<p>{game.creator.username}</p>
						</div>

						<div className="flex flex-col flex-[1]">
							<p className="font-semibold">ID</p>
							<p>{game.id}</p>
						</div>

						<Button
							variant="contained"
							onClick={() => {
								if (loggedInUser) {
									console.log(`Vill gå med i math #${game.id}`)
								} else {
									console.log(`Vill observera math #${game.id}`)
								}
							}}
						>
							{loggedInUser ? 'Gå med' : 'Observera'}
						</Button>
					</div>
				))}

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
						Skapa ny match
					</Button>
				)}
			</div>
		</div>
	)
}

export default Lobby
