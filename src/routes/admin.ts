import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import { v4 as uuidv4 } from 'uuid'

import db from '../lib/db'

import functions from '../../views/components/functions'
import sanitize from '../lib/sanitize'

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (res.locals.user.pos === 'admin') {
      if (res.locals.user.grade < 9 && req.path != '/settings') {
        res.redirect('settings')
        return
      }
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

router.get('/list', async (req, res) => {
  // Sequential because parallel connections harm runtime in tests. Confirm later
  const students = await db.listUsers('students')
  const tutors = await db.listUsers('tutors')
  const admins = await db.listUsers('admins')
  const studentAllowed = await db.listAllowed('students')
  const tutorAllowed = await db.listAllowed('tutors')
  const adminAllowed = await db.listAllowed('admins')
  const increments = await db.listIncrements()
  const holidays = await db.listHolidays()
  const pastSessions = await db.listSessions(false)
  const upcomingSessions = await db.listSessions(true)
  res.render('pages/admin/list', {
    students: students,
    tutors: tutors,
    admins: admins,
    studentAllowed: studentAllowed,
    tutorAllowed: tutorAllowed,
    adminAllowed: adminAllowed,
    increments: increments,
    holidays: holidays,
    pastSessions: pastSessions,
    upcomingSessions: upcomingSessions,
    functions: functions
  })
})

router.get('/settings', (req, res) => {
  res.render('pages/admin/settings', { error: '' })
})

router.post('/apiReset', (req, res) => {
  const newApiKey = uuidv4()
  db.updateApiKey(res.locals.user.id, newApiKey)
  res.locals.user.api_key = newApiKey
  res.redirect('settings')
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
      'admins',
      res.locals.user.id,
      phone,
      req.body.grade,
      req.body.dark_theme || false
    )
    res.locals.user.phone = phone
    res.locals.user.grade = req.body.grade
    res.locals.user.dark_theme = req.body.dark_theme
    res.redirect('panel')
    return
  }
  res.render('pages/admin/settings', {
    error: 'Invalid grade or phone number'
  })
})

router.get('/manage', (req, res) => {
  res.render('pages/admin/manage', { error: '' })
})

router.post('/manage', async (req, res) => {
  const domainRegex =
    '^(@[\\w\\-.]+\\.[A-Za-z]{2,4}[\\W]*[,\\s]{1}[\\W]*)*(@[\\w\\-.]+\\.[A-Za-z]+)[\\W]*$'
  const emailRegex =
    '^[\\W]*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4}[\\W]*[,\\s]{1}[\\W]*)*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4})[\\W]*$'
  let error = ''
  error += allowUserInput(
    req.body.allowedStudentDomain,
    domainRegex,
    'students',
    'Failed to save allowed student domains\n'
  )
  error += allowUserInput(
    req.body.allowedTutors,
    emailRegex,
    'tutors',
    'Failed to save allowed tutors\n'
  )
  error += allowUserInput(
    req.body.allowedAdmins,
    emailRegex,
    'admins',
    'Failed to save allowed admins\n'
  )
  error += revokeUserInput(
    req.body.revokedStudentDomain,
    domainRegex,
    'students',
    'Failed to save removed student domains\n'
  )
  error += revokeUserInput(
    req.body.revokedTutors,
    emailRegex,
    'tutors',
    'Failed to save removed tutors\n'
  )
  error += revokeUserInput(
    req.body.revokedAdmins,
    emailRegex,
    'admins',
    'Failed to save removed admins\n'
  )

  if (req.body.add_hol) {
    db.createHoliday(req.body.add_hol)
  }
  if (req.body.rem_hol) {
    db.deleteHoliday(req.body.rem_hol)
  }

  if (req.body.add_inc_h != '-') {
    db.createIncrement(
      Number(req.body.add_inc_h) + Number(req.body.add_inc_m / 60)
    )
  }
  if (req.body.add_inc_h) {
    db.removeIncrement(
      Number(req.body.rem_inc_h) + Number(req.body.rem_inc_m / 60)
    )
  }

  if (req.body.adv_term) {
    db.advanceTerm()
  }
  if (req.body.inc_grade != undefined) {
    await db.incrementGrade()
  }
  if (req.body.rem_students != undefined) {
    db.truncateTable('students')
  } else if (req.body.rem_student_grade != undefined) {
    db.removeOldUsers('students')
  }
  if (req.body.rem_tutors != undefined) {
    db.truncateTable('tutors')
  } else if (req.body.rem_tutor_grade != undefined) {
    db.removeOldUsers('tutors')
  }

  if (error != '') {
    res.render('pages/admin/manage', { error: error })
    return
  }
  res.redirect('panel')
})

export { router }

function allowUserInput(
  request: string,
  regex: string,
  database: string,
  error: string
) {
  if (request.match(regex)) {
    const array = request
      .split(/[, ]+/)
      .map((element: string) => element.trim())

    let string = ''
    for (let i = 0; i < array.length; i++) {
      string += "('" + array[i].toLowerCase() + "'),"
    }
    string = string.replace(/,$/, '')
    db.allowUser(database, string)
    return ''
  }
  if (!request.match('^$')) {
    return error
  }
  return ''
}

function revokeUserInput(
  request: string,
  regex: string,
  database: string,
  error: string
) {
  if (request.match(regex)) {
    const array = request
      .split(/[, ]+/)
      .map((element: string) => element.trim())

    let string = '('
    for (let i = 0; i < array.length; i++) {
      string += "'" + array[i].toLowerCase() + "',"
    }
    string = string.replace(/,$/, ')')
    db.revokeUser(database, string)
    return ''
  }
  if (!request.match('^$')) {
    return error
  }
  return ''
}
