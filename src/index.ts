// Web Server Setup
import express from 'express'
import bodyParser from 'body-parser'
const app = express()
// Allows API requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
const port = 8080

// Auth Support
import passport from 'passport'
import session from 'express-session'
import dotenv from 'dotenv'
dotenv.config()

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  })
)
require('./strategies/google')
app.use(passport.initialize())
app.use(passport.session())

// Static Web Files
app.use(express.static('public'))
app.use(express.static('public/icons')) //Flattens icons to public for support reasons

// Routing
import { router as root } from './routes/root'
import { router as student } from './routes/student'
import { router as tutor } from './routes/tutor'
import { router as admin } from './routes/admin'
import { router as api } from './routes/api'

app.use('/', root)
app.use('/student', student)
app.use('/tutor', tutor)
app.use('/admin', admin)
app.use('/api', api)

app.listen(port, () => {
  console.log(`Example app listening on http://127.0.0.1:${port}`)
})
