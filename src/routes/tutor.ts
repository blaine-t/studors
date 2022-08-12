import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (res.locals.user.pos === 'tutor') {
      next()
      return
    }
  }
  res.redirect('/auth/tutor')
}

router.use(checkAuthentication)

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

export { router }
