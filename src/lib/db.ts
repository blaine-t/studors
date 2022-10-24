import { Pool } from 'pg'
// Pulls connection info from .env variables. See: https://node-postgres.com/features/connecting
const pool = new Pool()

// Perform a simple delete from the database
async function deleteWhere(database: string, key: string, value: string) {
  try {
    pool.query(`DELETE FROM ${database} WHERE ${key} = ${value}`)
  } catch (err) {
    console.log(err)
  }
}

// Used for removing student and tutor rosters
async function truncateTable(table: string) {
  try {
    pool.query(`TRUNCATE TABLE ${table} CASCADE`)
  } catch (err) {
    console.log(err)
  }
}

// Create a student, tutor, or admin
async function createUser(
  role: string,
  id: string,
  first_name: string,
  last_name: string,
  picture: string,
  email: string
) {
  try {
    pool.query(
      `INSERT INTO ${role} (id,first_name,last_name,picture,email) VALUES ($1,$2,$3,$4,$5)`,
      [id, first_name, last_name, picture, email.toLowerCase()]
    )
  } catch (err) {
    console.log(err)
  }
}

// Ensure that the user is in the database
async function authUser(role: string, id: string) {
  try {
    const res = await pool.query(`SELECT * FROM ${role} WHERE id = $1`, [id])
    return res.rows[0]
  } catch (err) {
    console.log(err)
  }
}

// List all users in the database based on role
async function listUsers(role: string) {
  let extraQuery = ''
  if (role == 'tutors') {
    extraQuery = ', hours_term, hours_total'
  }
  try {
    const res = await pool.query(
      `SELECT first_name, last_name, grade, email, phone${extraQuery} 
      FROM ${role} 
      ORDER BY last_name
      `
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Update a user's settings
async function updateUser(
  role: string,
  id: string,
  phone: string,
  grade: number,
  dark_theme: boolean
) {
  try {
    pool.query(
      `UPDATE ${role} SET phone = $2, grade = $3, dark_theme = $4 WHERE id = $1`,
      [id, phone, grade, dark_theme]
    )
  } catch (err) {
    console.log(err)
  }
}

// Manage the whitelist of different roles
async function allowUser(role: string, email: string) {
  try {
    pool.query(
      `INSERT INTO allowed${role} (email) VALUES ${email} ON CONFLICT DO NOTHING`
    )
  } catch (err) {
    console.log(err)
  }
}

// Check on registration if user is allowed to register
async function checkUser(role: string, email: string) {
  try {
    const res = await pool.query(
      `SELECT * FROM allowed${role} WHERE email = $1`,
      [email]
    )
    return res.rows[0]
  } catch (err) {
    console.log(err)
  }
}

// List allowed users for admin page
async function listAllowed(role: string) {
  try {
    const res = await pool.query(
      `SELECT email FROM allowed${role} ORDER BY email`
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Remove a user from a whitelist
async function revokeUser(role: string, email: string) {
  try {
    pool.query(`DELETE FROM allowed${role} WHERE email IN ${email}`)
  } catch (err) {
    console.log(err)
  }
}

// Create a tutoring session
async function createSession(
  sid: string,
  tid: string,
  time: Date,
  subject: string
) {
  try {
    pool.query(
      'INSERT INTO sessions (student_id,tutor_id,time_id,subject_id) VALUES ($1,$2,$3,$4)',
      [sid, tid, time, subject]
    )
  } catch (err) {
    console.log(err)
  }
}

// List out all sessions upcoming or past
async function listSessions(upcoming: boolean) {
  let operator = ''
  if (upcoming) {
    operator = '>'
  } else {
    operator = '<'
  }
  try {
    const res = await pool.query(
      `SELECT sessions.time_id, tutors.first_name as tutor_name, tutors.last_name as tutor_surname, 
      students.first_name as student_name, students.last_name as student_surname, sessions.subject_id, sessions.hours
      FROM sessions
      INNER JOIN tutors on sessions.tutor_id = tutors.id
      INNER JOIN students on sessions.student_id = students.id
      WHERE time_id ${operator} now()
      ORDER BY time_id`
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Get a list of hours for tutors
async function getHours() {
  try {
    const res = await pool.query(
      `SELECT last_name, first_name, hours_term, hours_total FROM tutors ORDER BY last_name`
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Makes sure API key is valid
async function confirmApiKey(apiKey: string) {
  if (apiKey != null) {
    try {
      const res = await pool.query(
        `SELECT api_key FROM admins WHERE api_key = $1`,
        [apiKey]
      )
      return res.rows[0]
    } catch (err) {
      console.log(err)
    }
  }
}

// Changes API Key on user request
async function updateApiKey(id: string, apiKey: string) {
  try {
    pool.query('UPDATE admins SET api_key = $2::uuid WHERE id = $1', [
      id,
      apiKey
    ])
  } catch (err) {
    console.log(err)
  }
}

// Deletes students current term hours
async function advanceTerm() {
  try {
    pool.query('UPDATE tutors SET hours_term = 0')
  } catch (err) {
    console.log(err)
  }
}

// Ups grade of all accounts below grade 13
async function incrementGrade() {
  try {
    pool.query('UPDATE students SET grade = grade + 1 WHERE grade < 13')
  } catch (err) {
    console.log(err)
  }
  try {
    pool.query('UPDATE tutors SET grade = grade + 1 WHERE grade < 13')
  } catch (err) {
    console.log(err)
  }
  try {
    pool.query('UPDATE admins SET grade = grade + 1 WHERE grade < 13')
  } catch (err) {
    console.log(err)
  }
}

// Removes users that have grade above 12
async function removeOldUsers(role: string) {
  try {
    pool.query(`DELETE FROM ${role} WHERE grade > 12`)
  } catch (err) {
    console.log(err)
  }
}

// Gets the previous Sunday
function getSunday(date = new Date()) {
  const previousSunday = new Date()

  previousSunday.setDate(date.getDate() - date.getDay())

  previousSunday.setHours(0, 0, 0, 0)

  return previousSunday
}

// Creates the times for the week
async function createDates() {
  try {
    let times = ''
    const res = await pool.query(`SELECT hour from increments`)
    const offDays = await pool.query('SELECT holiday from holidays')
    if (res.rows.length != 0) {
      for (let i = 1; i < 6; i++) {
        for (let j = 0; j < res.rows.length; j++) {
          const time = getSunday()
          let holiday = false
          time.setDate(time.getDate() + i)
          for (let k = 0; k < offDays.rows.length; k++) {
            if (time.getDate() === offDays.rows[k].holiday.getDate()) {
              holiday = true
            }
          }
          if (!holiday) {
            time.setHours(res.rows[j].hour, (res.rows[j].hour % 1) * 60, 0, 0)
            times += "('" + new Date(time).toISOString() + "'),"
          }
        }
      }
      times = times.replace(/,$/, '')
      pool.query(
        `INSERT into times (time) VALUES ${times} ON CONFLICT DO NOTHING`
      )
    }
  } catch (err) {
    console.log(err)
  }
}

// List times available in between two dates
async function listTimesBetweenDates(afterTime: Date, beforeTime: Date) {
  try {
    const res = await pool.query(
      'SELECT time FROM times WHERE time > $1 AND time < $2',
      [afterTime, beforeTime]
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Lists the current times available this week
async function listCurrentWeekTimes() {
  const res = []
  const sun = getSunday()
  for (let i = 1; i < 6; i++) {
    const afterTime = new Date()
    afterTime.setDate(sun.getDate() + i)
    afterTime.setHours(0, 0, 0, 0)
    const beforeTime = new Date()
    beforeTime.setDate(afterTime.getDate() + 1)
    beforeTime.setHours(0, 0, 0, 0)
    res.push(await listTimesBetweenDates(afterTime, beforeTime))
  }
  return res
}

// Creates a time slot
async function createIncrement(hour: number) {
  try {
    pool.query(
      'INSERT INTO increments (hour) VALUES ($1) ON CONFLICT DO NOTHING',
      [hour]
    )
  } catch (err) {
    console.log(err)
  }
}

// List time slots
async function listIncrements() {
  try {
    const res = await pool.query('SELECT hour FROM increments ORDER BY hour')
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Remove a time slot
async function removeIncrement(hour: number) {
  try {
    pool.query('DELETE FROM increments WHERE hour = $1', [hour])
  } catch (err) {
    console.log(err)
  }
}

// Create an off day
async function createHoliday(date: Date) {
  try {
    pool.query('INSERT INTO holidays (holiday) VALUES ($1)', [date])
  } catch (err) {
    console.log(err)
  }
}

// List off days
async function listHolidays() {
  try {
    const res = await pool.query(
      'SELECT holiday FROM holidays WHERE holiday > now()'
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Remove an off day
async function deleteHoliday(date: Date) {
  try {
    pool.query('DELETE FROM holidays WHERE holiday = $1', [date])
  } catch (err) {
    console.log(err)
  }
}

// Create weekly availability options based on increments
async function createWeeklyAvailability() {
  try {
    let string = ''
    const increments = await listIncrements()
    if (increments != undefined) {
      for (let i = 0; i < increments.length; i++) {
        for (let j = 1; j < 6; j++) {
          string += '(' + j + ',' + increments[i]['hour'] + '),'
        }
      }
      string = string.replace(/,$/, '')
      const res = await pool.query(
        `INSERT into weeklyavailability (dow,increment_id) VALUES ${string} ON CONFLICT DO NOTHING`
      )
      return res.rows
    }
  } catch (err) {
    console.log(err)
  }
}

// List weekly availability options
async function listWeeklyAvailability() {
  try {
    const res = await pool.query(
      'SELECT id, dow, increment_id FROM weeklyavailability ORDER BY increment_id, dow'
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Add a tutor to a weekly availability slot
async function addTutorWeeklyAvailability(tid: string, aid: string) {
  try {
    pool.query(
      'INSERT INTO weeklyavailabilitymap (tutor_id,weeklyavailability_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [tid, aid]
    )
  } catch (err) {
    console.log(err)
  }
}

// List what times a tutor is available
async function listTutorAvailability(id: string) {
  try {
    const res = await pool.query(
      'SELECT time_id FROM availabilitymap WHERE tutor_id = $1',
      [id]
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// List what times of week a tutor is available
async function listTutorWeeklyAvailability(id: string) {
  try {
    const res = await pool.query(
      'SELECT weeklyavailability_id FROM weeklyavailabilitymap WHERE tutor_id = $1',
      [id]
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Don't know what this does but it's required
async function listWeeklyAvailabilityAtIncrement(increment: number) {
  try {
    const res = await pool.query(
      'SELECT id, dow, increment_id FROM weeklyavailability WHERE increment_id = $1',
      [increment]
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Give data to allow migration from weekly to exact times
async function listWeeklyAvailabilityMap() {
  try {
    const res = await pool.query(
      `SELECT weeklyavailabilitymap.tutor_id, weeklyavailability.dow, weeklyavailability.increment_id 
      FROM weeklyavailabilitymap
      INNER JOIN weeklyavailability on weeklyavailabilitymap.weeklyavailability_id = weeklyavailability.id`
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Migrate relative weekly times to exact times
async function migrateWeeklyToDates() {
  const weeklyAvailability = await listWeeklyAvailabilityMap()
  let string = ''

  if (weeklyAvailability == undefined || weeklyAvailability.length == 0) {
    return
  }

  for (let i = 0; i < weeklyAvailability.length; i++) {
    const time = getSunday()
    const increment = weeklyAvailability[i]['increment_id']
    time.setDate(time.getDate() + weeklyAvailability[i]['dow'])
    time.setHours(increment, (increment % 1) * 60, 0, 0)
    string +=
      "('" +
      new Date(time).toISOString() +
      "','" +
      weeklyAvailability[i]['tutor_id'] +
      "'),"
  }
  string = string.replace(/,$/, '')
  try {
    pool.query(
      `INSERT INTO availabilitymap (time_id, tutor_id) VALUES ${string} ON CONFLICT DO NOTHING`
    )
  } catch (err) {
    console.log(err)
  }
}

// Removes a tutor from a weekly availability slot
async function removeTutorWeeklyAvailability(tid: string, aid: string) {
  try {
    pool.query(
      'DELETE FROM weeklyavailabilitymap WHERE tutor_id = $1 AND weeklyavailability_id = $2',
      [tid, aid]
    )
  } catch (err) {
    console.log(err)
  }
}

// Create a subject name
async function createSubject(string: string) {
  try {
    pool.query(
      `INSERT INTO subjects (subject) VALUES ${string} ON CONFLICT DO NOTHING`
    )
  } catch (err) {
    console.log(err)
  }
}

// List subjects from list
async function listSubjects() {
  try {
    const res = await pool.query('SELECT subject FROM subjects')
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Remove a subject from the list
async function removeSubject(string: string) {
  try {
    pool.query(`DELETE FROM subjects WHERE subject IN ${string}`)
  } catch (err) {
    console.log(err)
  }
}

// Add a tutor to a subject
async function addTutorsSubject(sid: string, tid: string) {
  try {
    pool.query(
      'INSERT INTO subjectmap (subject_id,tutor_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [sid, tid]
    )
  } catch (err) {
    console.log(err)
  }
}

// List what subjects a tutor is in
async function listTutorsSubjects(id: string) {
  try {
    const res = await pool.query(
      'SELECT subject_id FROM subjectmap WHERE tutor_id = $1',
      [id]
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// Remove a tutor from a subject
async function removeTutorsSubject(sid: string, tid: string) {
  try {
    pool.query(
      'DELETE FROM subjectmap WHERE subject_id = $1 AND tutor_id = $2',
      [sid, tid]
    )
  } catch (err) {
    console.log(err)
  }
}

// List all available time slots in db
async function listAvailability() {
  try {
    const res = await pool.query(
      `SELECT availabilitymap.time_id, availabilitymap.tutor_id, subjectmap.subject_id
      FROM availabilitymap
      INNER JOIN subjectmap on availabilitymap.tutor_id = subjectmap.tutor_id
      ORDER BY availabilitymap.tutor_id, availabilitymap.time_id`
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

// List all available time slots for a specific subject
async function listAvailabilityForSubject(subject: string) {
  try {
    const res = await pool.query(
      `SELECT time_id 
      FROM availabilitymap 
      WHERE tutor_id IN 
      (SELECT tutor_id 
        FROM subjectmap
        WHERE subject = $1)`,
      [subject]
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

export default {
  deleteWhere,
  truncateTable,
  createUser,
  authUser,
  listUsers,
  updateUser,
  allowUser,
  checkUser,
  listAllowed,
  revokeUser,
  createSession,
  listSessions,
  getHours,
  confirmApiKey,
  updateApiKey,
  advanceTerm,
  incrementGrade,
  removeOldUsers,
  createDates,
  listTimesBetweenDates,
  listCurrentWeekTimes,
  createIncrement,
  listIncrements,
  removeIncrement,
  createHoliday,
  listHolidays,
  deleteHoliday,
  createWeeklyAvailability,
  listWeeklyAvailability,
  addTutorWeeklyAvailability,
  listTutorAvailability,
  listTutorWeeklyAvailability,
  listWeeklyAvailabilityAtIncrement,
  listWeeklyAvailabilityMap,
  migrateWeeklyToDates,
  removeTutorWeeklyAvailability,
  createSubject,
  listSubjects,
  removeSubject,
  addTutorsSubject,
  listTutorsSubjects,
  removeTutorsSubject,
  listAvailability,
  listAvailabilityForSubject
}
