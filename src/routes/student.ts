import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import db from '../lib/db'
import sanitize from '../lib/sanitize'

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (res.locals.user.pos === 'student') {
      if (res.locals.user.grade < 9 && req.path != '/settings') {
        res.redirect('settings')
        return
      }
      next()
      return
    }
  }
  res.redirect('/auth/student')
}

router.use(checkAuthentication)

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
  res.render('pages/student/settings', { error: '' })
})

router.post('/settings', (req, res) => {
  if (
    ((req.body.phone.match(
      '^[(]?([2-9][0-8][0-9])[)]?[-|\\s]?([2-9][0-9]{2})[-|\\s]?([0-9]{4})$'
    ) &&
      sanitize.phone(req.body.phone)) ||
      req.body.phone.match('^$')) &&
    (req.body.grade.match('[9]') || req.body.grade.match('[1][0-2]'))
  ) {
    const phone = String(sanitize.phone(req.body.phone))
    db.updateUser(
      'students',
      res.locals.user.id,
      phone,
      req.body.grade,
      req.body.dark_theme || false
    )
    res.locals.user.phone = phone
    res.locals.user.grade = req.body.grade
    res.locals.user.dark_theme = req.body.dark_theme
    res.redirect('home')
    return
  }
  res.render('pages/student/settings', {
    error: 'Invalid grade or phone number'
  })
})

router.get('/upcoming', (req, res) => {
  res.render('pages/student/upcoming')
})

router.get('/history', (req, res) => {
  res.render('pages/student/history')
})

export { router }
