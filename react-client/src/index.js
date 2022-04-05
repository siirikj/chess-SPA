import React from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './App'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Navigation from './components/Navigation'
import ChessGame from './pages/ChessGame'

const rootElement = document.getElementById('root')

render(
	<BrowserRouter>
		<Routes>
			<Route element={<Navigation />}>
				<Route path="/" element={<App />} />
				<Route path="home" element={<Home />} />
				<Route path="lobby" element={<Lobby />} />
				<Route path="login" element={<Login />} />
				<Route path="profile" element={<Profile />} />
				<Route path="register" element={<Register />} />
				<Route path="chessGame" element={<ChessGame />} />
			</Route>
		</Routes>
	</BrowserRouter>,
	rootElement
)
