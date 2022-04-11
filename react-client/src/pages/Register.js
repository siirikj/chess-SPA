import { Button, TextField } from '@mui/material'
import { Formik, Form } from 'formik'

import { useRecoilValue } from 'recoil'
import axios from 'axios'

import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '..'
import loggedInUserAtom from '../recoil/loggedInUserAtom'

const RegisterSchema = Yup.object().shape({
	username: Yup.string()
		.min(3, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	password: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
})

const Register = ({ socket }) => {
	const navigate = useNavigate()

	const loggedInUser = useRecoilValue(loggedInUserAtom)

	const [errorMsg, setErrorMsg] = useState(null)

	useEffect(() => {
		if (loggedInUser) navigate('/profile')
	}, [loggedInUser])

	if (loggedInUser) return null

	return (
		<div className="w-full flex items-center flex-col">
			<h2>Register account</h2>
			<Formik
				initialValues={{ username: '', password: '' }}
				validationSchema={RegisterSchema}
				onSubmit={async (values) => {
					const res = await axios.post(`${API_BASE_URL}/register`, values)
					const { success } = res.data

					if (success) {
						socket.emit('loginUser', { username: values.username })

						navigate('/lobby')
					} else {
						setErrorMsg('That username already exists!')
					}
				}}
			>
				{({ errors, touched, values, handleChange }) => (
					<Form className="flex flex-col gap-y-4 items-center shadow-md rounded bg-white px-6 py-5 w-fit">
						<TextField
							sx={{ width: '320px' }}
							fullWidth
							id="username"
							name="username"
							label="Username"
							type="text"
							value={values.username}
							onChange={(newText) => {
								setErrorMsg(null)
								handleChange(newText)
							}}
							error={touched.username && Boolean(errors.username)}
							helperText={touched.username && errors.username}
						/>

						<TextField
							sx={{ width: '320px' }}
							fullWidth
							type="password"
							id="password"
							name="password"
							label="Password"
							value={values.password}
							onChange={(newText) => {
								setErrorMsg(null)
								handleChange(newText)
							}}
							error={touched.password && Boolean(errors.password)}
							helperText={touched.password && errors.password}
						/>

						<Button type="submit" variant="contained" sx={{ width: '320px' }}>
							Submit
						</Button>

						{errorMsg && <p className="text-red-500">{errorMsg}</p>}
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default Register
