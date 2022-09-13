import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

function checkHome(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (res.locals.user.pos === 'student') {
      res.redirect('/student/home')
    } else if (res.locals.user.pos === 'tutor') {
      res.redirect('/tutor/home')
    } else if (res.locals.user.pos === 'admin') {
      res.redirect('/admin/panel')
    } else {
      next()
      return
    }
  } else {
    next()
    return
  }
}

router.use(checkHome)

router.get('/', (req, res) => {
  res.redirect('/')
})

export { router }
