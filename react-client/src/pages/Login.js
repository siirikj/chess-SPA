import { Button, TextField } from '@mui/material'
import { Formik, Form } from 'formik'

import * as Yup from 'yup'

const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	password: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
})

const Login = () => {
	return (
		<div className="w-full flex justify-center">
			<Formik
				initialValues={{ email: '', password: '' }}
				validationSchema={LoginSchema}
				onSubmit={(values, { setSubmitting }) => {
					console.log(values)
				}}
			>
				{({ isSubmitting, errors, touched, values, handleChange }) => (
					<Form className="flex flex-col gap-y-4 items-center shadow-md rounded bg-white px-6 py-5 w-fit">
						<TextField
							sx={{ width: '320px' }}
							fullWidth
							id="email"
							name="email"
							label="Email"
							type="email"
							value={values.email}
							onChange={handleChange}
							error={touched.email && Boolean(errors.email)}
							helperText={touched.email && errors.email}
						/>

						<TextField
							sx={{ width: '320px' }}
							fullWidth
							type="password"
							id="password"
							name="password"
							label="Password"
							value={values.password}
							onChange={handleChange}
							error={touched.password && Boolean(errors.password)}
							helperText={touched.password && errors.password}
						/>

						<Button type="submit" variant="contained" sx={{ width: '320px' }}>
							Submit
						</Button>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default Login
