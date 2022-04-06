import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import loggedInUserAtom from '../recoil/loggedInUserAtom.js'

const Profile = () => {
	const navigate = useNavigate()

	const loggedInUser = useRecoilValue(loggedInUserAtom)

	useEffect(() => {
		if (!loggedInUser) navigate('/login')
	}, [loggedInUser])

	if (!loggedInUser) return null

	return (
		<div>
			<h1>Profile</h1>
			<p>Username: {loggedInUser?.username}</p>
		</div>
	)
}

export default Profile
