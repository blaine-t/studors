// Web Server Setup
import express from 'express'
import bodyParser from 'body-parser'
const app = express()

// Allows API requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Allows variable HTML AKA EJS
app.set('view engine', 'ejs')
const port = 8080

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
import { router as student } from './routes/student'
import { router as tutor } from './routes/tutor'
import { router as admin } from './routes/admin'
import { router as api } from './routes/api'
import { router as auth } from './routes/auth'

// Require authentication for certain routes on the site
app.use('/', root)
app.use('/student', student)
app.use('/tutor', tutor)
app.use('/admin', admin)
app.use('/api', api)
app.use('/auth', auth)

// Have the server listen for incoming requests
app.listen(port, () => {
  console.log(`Example app listening on http://127.0.0.1:${port}`)
})
