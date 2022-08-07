// Web Server Setup
import express from 'express'
import bodyParser from 'body-parser'
//import helmet from 'helmet'
const app = express()
//app.use(helmet()) // Adds extra security to express by default
// Allows API requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
const port = 8080

// Import other files
import api from './api'

// Static Web Files
app.use(express.static('public'))
app.use(express.static('public/icons')) //Flattens icons to public for support reasons

// Routing
app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/tutor/register', (req, res) => {
  res.render('pages/tutor/register')
})

app.get('/student/register', (req, res) => {
  res.render('pages/student/register')
})

app.post('/api/getHours', async (req, res) => {
  res.json(await api.acceptRequest(req.body.apiKey))
})

app.listen(port, () => {
  console.log(`Example app listening on http://127.0.0.1:${port}`)
})
