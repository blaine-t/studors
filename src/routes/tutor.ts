import express from 'express'
const router = express.Router()

router.get('/register', (req, res) => {
  res.render('pages/tutor/register')
})

router.get('/home', (req, res) => {
  res.render('pages/tutor/home')
})

router.get('/request', (req, res) => {
  res.render('pages/tutor/request')
})

router.get('/settings', (req, res) => {
  res.render('pages/tutor/settings')
})

router.get('/upcoming', (req, res) => {
  res.render('pages/tutor/upcoming')
})

router.get('/history', (req, res) => {
  res.render('pages/tutor/history')
})

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

router.get('/login', (req, res) => {
  res.redirect('/')
})

export { router }
