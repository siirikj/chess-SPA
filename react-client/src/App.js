import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Lobby from './pages/Lobby'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Navigation from './components/Navigation'
import ChessGame from './pages/ChessGame'
import { CircularProgress } from '@mui/material'

import io from 'socket.io-client'
import { useEffect } from 'react'
import ChessGameTemp from './pages/ChessGameTemp'
import { useRecoilState } from 'recoil'
import loggedInUserAtom from './recoil/loggedInUserAtom'

const socket = io.connect('http://localhost:8080')

const App = () => {
	console.log(socket)
	const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserAtom)

	useEffect(() => {
		socket.on('userGotLoggedIn', (args) => {
			const { username, sessionId } = args
			console.log(username, sessionId)

			setLoggedInUser({
				username,
				sessionId,
			})
		})

		return () => socket.disconnect()
	}, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Navigation socket={socket} />}>
					<Route path="/" element={<Lobby />} />
					<Route
						path="lobby"
						element={
							socket?.connected || true ? (
								<Lobby socket={socket} />
							) : (
								<div className="w-full flex justify-center mt-3">
									<CircularProgress size={60} />
								</div>
							)
						}
					/>
					<Route path="login" element={<Login socket={socket} />} />
					<Route path="profile" element={<Profile />} />
					<Route path="register" element={<Register />} />
					<Route path="chessGame" element={<ChessGame />} />

					<Route
						path="chessGame/:chessGameId"
						element={<ChessGameTemp socket={socket} />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
