import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next()
  } else {
    res.redirect('/auth/admin')
  }
}

router.use(checkAuthentication)

router.get('/panel', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('pages/admin/panel', {
      user: req.user
    })
  } else {
    res.redirect('/auth/admin')
  }
})

router.get('/settings', (req, res) => {
  if (req.user) {
    res.render('pages/admin/settings', {
      user: req.user
    })
  } else {
    res.redirect('/auth/admin')
  }
})

export { router }
