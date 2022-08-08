import express from 'express'
const router = express.Router()

import api from '../lib/api'

router.post('/getHours', async (req, res) => {
  res.json(await api.acceptHoursRequest(req.body.apiKey))
})

export { router }
