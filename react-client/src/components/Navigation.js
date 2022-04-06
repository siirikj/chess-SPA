import { Link, Outlet } from 'react-router-dom'

import { useRecoilState } from 'recoil'
import loggedInUserAtom from '../recoil/loggedInUserAtom.js'
import { useCookies } from 'react-cookie'
import { useEffect } from 'react'

const StyledLink = ({ to, children }) => {
	return (
		<Link to={to} className="px-2 py-1 hover:bg-slate-200 rounded">
			{children}
		</Link>
	)
}

const Navigation = () => {
	const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserAtom)
	const [cookies, setCookie, removeCookie] = useCookies(['logged-in-user'])

	useEffect(() => {
		if (cookies) {
			const userFromCookie = cookies['logged-in-user']
			if (userFromCookie) setLoggedInUser({ username: userFromCookie.username })
		}
	}, [cookies])

	return (
		<div className="min-h-screen flex flex-col">
			<nav className="py-2 w-full border-b-2 border-slate-400 bg-white font-light flex items-center justify-center gap-x-4">
				<StyledLink to="home">Home</StyledLink>
				<StyledLink to="lobby">Lobby</StyledLink>
				{!loggedInUser && (
					<>
						<StyledLink to="login">Login</StyledLink>
						<StyledLink to="register">Register</StyledLink>
					</>
				)}

				{loggedInUser && (
					<>
						<StyledLink to="profile">Profile</StyledLink>
						<button
							className="px-2 py-1 hover:bg-slate-200 rounded font-light"
							onClick={() => {
								removeCookie('logged-in-user', {
									path: '/',
									domain: 'localhost',
								})
								setLoggedInUser(null)
							}}
						>
							Logout
						</button>
					</>
				)}
			</nav>

			<div className="w-full flex justify-center h-full flex-[1] bg-slate-100">
				<div className="max-w-[1100px] w-[90%] font-light py-7">
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Navigation
