import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import db from '../lib/db'

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (res.locals.user.pos === 'tutor') {
      if (res.locals.user.grade < 9 && req.path != '/settings') {
        res.redirect('settings')
        return
      }
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

router.get('/find', (req, res) => {
  res.render('pages/tutor/find')
})

router.get('/settings', (req, res) => {
  res.render('pages/tutor/settings', { error: '' })
})

router.get('/upcoming', (req, res) => {
  res.render('pages/tutor/upcoming')
})

router.get('/history', (req, res) => {
  res.render('pages/tutor/history')
})

router.post('/settings', (req, res) => {
  if (
    (req.body.phone.match(
      '^([2-9][0-8][0-9])[-]([2-9][0-9]{2})[-]([0-9]{4})$'
    ) ||
      req.body.phone.match('')) &&
    (req.body.grade.match('[9]') || req.body.grade.match('[1][0-2]'))
  ) {
    db.updateTutor(
      res.locals.user.id,
      req.body.phone,
      req.body.grade,
      [''],
      [new Date()],
      req.body.dark_theme || false
    )
    res.locals.user.phone = req.body.phone
    res.locals.user.grade = req.body.grade
    res.locals.user.dark_theme = req.body.dark_theme
    res.redirect('home')
    return
  }
  res.render('pages/student/settings', {
    error: 'Invalid grade or phone number'
  })
})

export { router }
