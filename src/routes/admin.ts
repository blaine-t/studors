import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import { v4 as uuidv4 } from 'uuid'

import db from '../lib/db'

import functions from '../../views/components/functions'

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

router.get('/list', async (req, res) => {
  // Sequential because parrallel connections harm runtime in tests. Confirm later
  const students = await db.listUsers('students')
  const tutors = await db.listUsers('tutors')
  const admins = await db.listUsers('admins')
  const studentDomains = await db.listUsers('allowedstudents')
  const tutorEmails = await db.listUsers('allowedtutors')
  const adminEmails = await db.listUsers('allowedadmins')
  const pastSessions = await db.listSessions(false)
  const upcomingSessions = await db.listSessions(true)
  res.render('pages/admin/list', {
    students: students,
    tutors: tutors,
    admins: admins,
    studentAllowed: studentDomains,
    tutorAllowed: tutorEmails,
    adminAllowed: adminEmails,
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
  if (
    req.body.phone.match('^([2-9][0-8][0-9])[-]([2-9][0-9]{2})[-]([0-9]{4})$')
  ) {
    db.updateUser(
      'admins',
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
  if (req.body.rem_admins) {
    db.truncateTable('admins')
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
