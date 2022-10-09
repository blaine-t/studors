import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import db from '../lib/db'
import sanitize from '../lib/sanitize'
import functions from '../../views/components/functions'

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

router.get('/availability', async (req, res) => {
  const increments = await db.listIncrements()
  const times = []
  let j = 0
  if (increments == undefined) {
    return
  }
  for (let i = 0; i < increments.length; i++) {
    const time = increments[i]['hour']
    const push = [time, '', '', '', '', '']
    const week = await db.listWeeklyAvailabilityAtTime(time)
    if (week == undefined) {
      return
    }
    for (j = 0; j < 5; j++) {
      const h = week[j]['dow']
      push[h] = week[j]['id']
    }
    times.push(push)
  }
  res.render('pages/tutor/availability', {
    times: times,
    functions: functions
  })
})

router.get('/subjects', (req, res) => {
  res.render('pages/tutor/subjects', { error: '' })
})

router.get('/upcoming', (req, res) => {
  res.render('pages/tutor/upcoming')
})

router.get('/history', (req, res) => {
  res.render('pages/tutor/history')
})

router.post('/settings', (req, res) => {
  const sanitizedPhone = sanitize.phone(req.body.phone)
  if (
    ((req.body.phone.match(
      '^[(]?([2-9][0-8][0-9])[)]?[-|\\s]?([2-9][0-9]{2})[-|\\s]?([0-9]{4})$'
    ) &&
      sanitizedPhone) ||
      req.body.phone.match('^$')) &&
    (req.body.grade.match('[9]') || req.body.grade.match('[1][0-3]'))
  ) {
    let phone = ''
    if (sanitizedPhone) {
      phone = sanitizedPhone
    }
    db.updateUser(
      'tutors',
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
  res.render('pages/tutor/settings', {
    error: 'Invalid grade or phone number'
  })
})

export { router }
