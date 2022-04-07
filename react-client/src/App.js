import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
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

const socket = io.connect('http://localhost:8080')

const App = () => {
	console.log(socket)

	useEffect(() => {
		socket.on('firstMsg', (msg) => {
			console.log(msg)
		})

		return () => socket.disconnect()
	}, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Navigation socket={socket} />}>
					<Route path="/" element={<Home />} />
					<Route path="home" element={<Home />} />
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
