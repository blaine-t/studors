import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
  res.render('pages/root/index')
})

router.get('/about', (req, res) => {
  res.render('pages/root/about')
})

router.get('/mission', (req, res) => {
  res.render('pages/root/mission')
})

router.get('/contact', (req, res) => {
  res.render('pages/root/contact')
})

router.get('/privacy', (req, res) => {
  res.render('pages/root/privacy')
})

router.get('/tos', (req, res) => {
  res.render('pages/root/tos')
})

export { router }
