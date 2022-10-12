// Web Server Setup
import express from 'express'
import bodyParser from 'body-parser'
const app = express()

// Helmet setup for security
import helmet from 'helmet'
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
    // ...
  })
)

// Allows API requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Allows variable HTML AKA EJS
app.set('view engine', 'ejs')
const port = 19090

// Auth Support
import passport from 'passport'
import session from 'express-session'

// Implement nonleaking memory store for cookies
import createMemoryStore from 'memorystore'
const MemoryStore = createMemoryStore(session)
import { v4 as uuidv4 } from 'uuid'

// Environment variable support for the project
import * as dotenv from 'dotenv'
dotenv.config()

// Setup cookie session store
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 604800000 // 7 Days
    },
    store: new MemoryStore({
      checkPeriod: 86400000
    })
  })
)

// Setup passport authentication
require('./strategies/google')
app.use(passport.initialize())
app.use(passport.session())

// Static Web Files
app.use(express.static('public'))
app.use(express.static('public/icons')) //Flattens icons to public for support reasons

// Routing
import { router as root } from './routes/root'
import { router as home } from './routes/home'
import { router as student } from './routes/student'
import { router as tutor } from './routes/tutor'
import { router as admin } from './routes/admin'
import { router as api } from './routes/api'
import { router as auth } from './routes/auth'
import db from './lib/db'

// Require authentication for certain routes on the site
app.use('/', root)
app.use('/home', home)
app.use('/student', student)
app.use('/tutor', tutor)
app.use('/admin', admin)
app.use('/api', api)
app.use('/auth', auth)

// Randomized 404
app.use(function (req, res) {
  const resCodes = [200, 301, 302]
  res.status(resCodes[Math.floor(Math.random() * resCodes.length)])

  // respond with html page
  let randString = ''
  for (let i = 0; i < Math.random() * 100; i++) {
    randString += Math.random().toString(36).slice(2)
  }
  res.render('pages/root/404', { url: req.url, string: randString })
  return
})

// Have the server listen for incoming requests
app.listen(port, () => {
  console.log(`Studors is listening on http://127.0.0.1:${port}`)
})

db.createDates()
db.migrateWeeklyToDates()
