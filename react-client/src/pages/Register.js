import { Button, TextField } from '@mui/material'
import { Formik, Form } from 'formik'

import * as Yup from 'yup'

const RegisterSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	password: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	email: Yup.string().email('Invalid email').required('Required'),
})

const Register = () => {
	return (
		<div className="w-full flex justify-center">
			<Formik
				initialValues={{ name: '', email: '', password: '' }}
				validationSchema={RegisterSchema}
				onSubmit={(values, { setSubmitting }) => {
					console.log(values)
				}}
			>
				{({ isSubmitting, errors, touched, values, handleChange }) => (
					<Form className="flex flex-col gap-y-4 items-center shadow-md rounded bg-white px-6 py-5 w-fit">
						<TextField
							sx={{ width: '320px' }}
							fullWidth
							id="name"
							name="name"
							label="Name"
							value={values.name}
							onChange={handleChange}
							error={touched.name && Boolean(errors.name)}
							helperText={touched.name && errors.name}
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

						<Button type="submit" variant="contained" sx={{ width: '320px' }}>
							Submit
						</Button>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default Register
