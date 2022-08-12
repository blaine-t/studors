import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next()
  } else {
    res.redirect('/auth/student')
  }
}

router.use(checkAuthentication)

router.get('/home', (req, res) => {
  res.render('pages/student/home', {
    user: req.user
  })
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
