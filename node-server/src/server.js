import express from 'express'
import cors from 'cors'

import auth from './controllers/auth.controller.js'
import lobby from './controllers/auth.controller.js'

import './database.js'

const app = express()
const port = 8080

app.use(cors())
app.use(express.json())
app.use(
	express.urlencoded({
		extended: true,
	})
)

// Controllers
app.use('/api', auth.router)
app.use('/api', lobby.router)

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Chess app listening on port ${port}`)
})
