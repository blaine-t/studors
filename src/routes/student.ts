import express from 'express'
import passport from 'passport'
const router = express.Router()

router.get('/register', (req, res) => {
  res.render('pages/student/register')
})

router.get('/home', (req, res) => {
  res.render('pages/student/home')
})

router.get('/find', (req, res) => {
  res.render('pages/student/find')
})

router.get('/request', (req, res) => {
  res.render('pages/student/request')
})

router.get('/settings', (req, res) => {
  res.render('pages/student/settings')
})

router.get('/upcoming', (req, res) => {
  res.render('pages/student/upcoming')
})

router.get('/history', (req, res) => {
  res.render('pages/student/history')
})

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

router.get('/login', passport.authenticate('google'), (req, res) => {
  res.send(200)
})

router.get('/auth', passport.authenticate('google'), (req, res) => {
  res.send(200)
})

export { router }
