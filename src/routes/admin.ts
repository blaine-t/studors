import express from 'express'
const router = express.Router()

router.get('/panel', (req, res) => {
  res.render('pages/admin/panel')
})

export { router }
