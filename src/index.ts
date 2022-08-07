// Web Server Setup
import express, { application } from 'express'
import bodyParser from 'body-parser'
//import helmet from 'helmet'
const app = express()
//app.use(helmet()) // Adds extra security to express by default
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const port = 8080

// Import other files
import db from './db'
import api from './api'

// Static Web Files
app.use(express.static('public'))
app.use(express.static('public/icons')) //Flattens icons to public for support reasons

// Routing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.post('/api/getHours', async (req, res) => {
  res.json(await api.acceptRequest(req.body.apiKey))
})

app.listen(port, () => {
  console.log(`Example app listening on http://127.0.0.1:${port}`)
})
