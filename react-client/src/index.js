import React from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './App'

import { RecoilRoot } from 'recoil'

export const SERVER_URL = 'http://localhost:8080'
export const API_BASE_URL = `${SERVER_URL}/api`

const rootElement = document.getElementById('root')

render(
	<RecoilRoot>
		<App />
	</RecoilRoot>,
	rootElement
)
