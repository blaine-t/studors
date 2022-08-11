import express from 'express'
const router = express.Router()

router.get('/home', (req, res) => {
  if (req.user) {
    res.render('pages/student/home', {
      user: req.user
    })
  } else {
    res.redirect('/auth/student')
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

export { router }
