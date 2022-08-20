import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import db from '../lib/db'

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
  res.render('pages/admin/settings', { error: '' })
})

router.post('/settings', (req, res) => {
  if (
    req.body.phone.match('^([2-9][0-8][0-9])[-]([2-9][0-9]{2})[-]([0-9]{4})$')
  ) {
    db.updateAdmin(
      res.locals.user.id,
      req.body.phone,
      req.body.dark_theme || false
    )
    res.locals.user.phone = req.body.phone
    res.locals.user.dark_theme = req.body.dark_theme
    res.redirect('panel')
    return
  }
  res.render('pages/admin/settings', { error: 'Failed to save phone number' })
})

router.get('/manage', (req, res) => {
  res.render('pages/admin/manage')
})

export { router }
