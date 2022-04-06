import express from 'express'

import auth from './controllers/auth.controller.js'
import lobby from './controllers/auth.controller.js'

import db from './models/db.model.js'

const app = express()
const port = 8080

// Controllers
app.use('/api', auth.router)
app.use('/api', lobby.router)

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Chess app listening on port ${port}`)
})
