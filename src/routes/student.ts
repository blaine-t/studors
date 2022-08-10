import express from 'express'
import passport from 'passport'
const router = express.Router()

router.get('/register', (req, res) => {
  res.redirect('http://localhost:8080/student/home')
})

router.get('/home', (req, res) => {
  if (req.user) {
    res.render('pages/student/home', {
      user: req.user
    })
  } else {
    res.redirect('http://localhost:8080/student/login')
  }
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

router.get('/login', (req, res) => {
  res.redirect('http://localhost:8080/student/login/google')
})

router.get('/login/google', passport.authenticate('google'))

router.get(
  '/auth/google',
  passport.authenticate('google', {
    successRedirect: '/student/register',
    failureRedirect: '/student/login'
  })
)

export { router }
