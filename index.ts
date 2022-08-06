// Web Server Setup
import express from 'express'
const app = express()
const port = 8080

// Prisma DB setup
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Static Web Files
app.use(express.static('public'))
app.use(express.static('public/icons')) //Flattens icons to public for support reasons

// Routing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.listen(port, () => {
  console.log(`Example app listening on http://127.0.0.1:${port}`)
})
