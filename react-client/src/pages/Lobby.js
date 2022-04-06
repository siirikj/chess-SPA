import { Button } from '@mui/material'
import loggedInUserAtom from '../recoil/loggedInUserAtom'

import { useRecoilValue } from 'recoil'

const MOCK_CHESS_GAMES = [
	{
		id: '4af7909d-2e3b-4c36-be0b-2448a48d394f',
		creator: 'siri',
	},
	{
		id: 'e140ff2a-0883-4ba6-9dfd-ef228a910b45',
		creator: 'rasmus',
	},
	{
		id: '639c3c92-8f20-4a78-80cb-cc97ed1050a9',
		creator: 'anna',
	},
]

const Lobby = () => {
	const loggedInUser = useRecoilValue(loggedInUserAtom)

	return (
		<div className="w-full flex flex-col items-center">
			<h2>Lobby</h2>
			<div className="w-full shadow-lg bg-white px-10 py-9 flex flex-col gap-y-3 ">
				{MOCK_CHESS_GAMES.map((game) => (
					<div
						key={game.id}
						className="w-full border border-slate-500 px-4 py-3 flex justify-between"
					>
						<div className="flex flex-col flex-[1]">
							<p className="font-semibold">Skapare</p>
							<p>{game.creator}</p>
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
						onClick={() =>
							console.log(`${loggedInUser.username} vill skapa ny match`)
						}
					>
						Skapa ny match
					</Button>
				)}
			</div>
		</div>
	)
}

export default Lobby
