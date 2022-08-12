import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (res.locals.user.pos === 'admin') {
      next()
      return
    }
  }
  res.redirect('/auth/admin')
}

router.use(checkAuthentication)

router.get('/panel', (req, res) => {
  res.render('pages/admin/panel')
})

router.get('/settings', (req, res) => {
  res.render('pages/admin/settings')
})

router.get('/manage', (req, res) => {
  res.render('pages/admin/manage')
})

export { router }
