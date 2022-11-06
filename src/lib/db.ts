import { Pool } from 'pg'
import functions from './functions'
// Pulls connection info from .env variables. See: https://node-postgres.com/features/connecting
const pool = new Pool()

/**
 * Remove rosters from the database
 * @param table Which table to truncate
 */
function truncateTable(table: string) {
  pool.query(`TRUNCATE TABLE ${table} CASCADE`).catch((e) => console.error(e))
}

/**
 * Create a student, tutor, or admin
 * @param role students, tutors, or admins
 * @param id OAuth ID (string)
 * @param first_name
 * @param last_name
 * @param picture profile picture URL
 * @param email Will be lowercased
 */
function createUser(
  role: string,
  id: string,
  first_name: string,
  last_name: string,
  picture: string,
  email: string
) {
  pool
    .query(
      `INSERT INTO ${role} (id,first_name,last_name,picture,email) VALUES ($1,$2,$3,$4,$5)`,
      [id, first_name, last_name, picture, email.toLowerCase()]
    )
    .catch((e) => console.error(e))
}

/**
 * Ensure that the user is in the database
 * @param role students, tutors, or admins
 * @param id OAuth ID (string)
 * @returns User's DB entry
 */
async function authUser(role: string, id: string) {
  try {
    const res = await pool.query(`SELECT * FROM ${role} WHERE id = $1`, [id])
    return res.rows[0]
  } catch (err) {
    console.log(err)
  }
}

/**
 * List all users in the database based on role
 * @param role students, tutors, or admins
 * @returns Array of users
 */
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

/**
 * Update a user's settings
 * @param role students, tutors, or admins
 * @param id OAuth ID (string)
 * @param phone User supplied phone number AFTER sanitization
 * @param grade 9-12 (number)
 * @param dark_theme
 */
function updateUser(
  role: string,
  id: string,
  phone: string,
  grade: number,
  dark_theme: boolean
) {
  pool
    .query(
      `UPDATE ${role} SET phone = $2, grade = $3, dark_theme = $4 WHERE id = $1`,
      [id, phone, grade, dark_theme]
    )
    .catch((e) => console.error(e))
}

/**
 * Add to the whitelist of different roles
 * @param role students, tutors, or admins
 * @param emailQuery Generated email query
 */
function allowUser(role: string, emailQuery: string) {
  pool
    .query(
      `INSERT INTO allowed${role} (email) VALUES ${emailQuery} ON CONFLICT DO NOTHING`
    )
    .catch((e) => console.error(e))
}

/**
 * Check on registration if user is allowed to register
 * @param role students, tutors, or admins
 * @param email Will be lowercased
 * @returns Array of users
 */
async function checkUser(role: string, email: string) {
  try {
    const res = await pool.query(
      `SELECT * FROM allowed${role} WHERE email = $1`,
      [email.toLowerCase()]
    )
    return res.rows[0]
  } catch (err) {
    console.log(err)
  }
}

/**
 * List allowed users for admin page
 * @param role students, tutors, or admins
 * @returns Array of users
 */
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

/**
 * Remove from the whitelist of different roles
 * @param role students, tutors, or admins
 * @param emailQuery Generated email query
 */
function revokeUser(role: string, emailQuery: string) {
  pool
    .query(`DELETE FROM allowed${role} WHERE email IN ${emailQuery}`)
    .catch((e) => console.error(e))
}

/**
 * Create a tutoring session (Use proper programming techniques)
 * @param sid OAuth ID (string)
 * @param tid OAuth ID (string)
 * @param time JS Date format
 * @param subject
 * @param duration Decimal in DB
 * @returns True if booking successful, false if booking fails
 */
async function createSession(
  sid: string,
  tid: string,
  time: Date,
  subject: string,
  duration: number
) {
  try {
    pool.query(
      'DELETE FROM availabilitymap WHERE time_id = $1 AND tutor_id = $2',
      [time, tid]
    )
    const res = await pool.query(
      'INSERT INTO sessions (student_id,tutor_id,time_id,subject_id,duration) VALUES ($1,$2,$3,$4,$5)',
      [sid, tid, time, subject, duration]
    )
    pool.query(
      'DELETE FROM availabilitymap WHERE time_id = $1 AND tutor_id = $2',
      [time, tid]
    )
    if (res) {
      try {
        pool.query(
          'UPDATE tutors SET hours_term = hours_term + $1 WHERE id = $2',
          [duration, tid]
        )
        pool.query(
          'UPDATE tutors SET hours_total = hours_total + $1 WHERE id = $2',
          [duration, tid]
        )
      } catch (err) {
        console.log(err)
      }
      return true
    }
  } catch (err) {
    console.log(err)
    return false
  }
}

/**
 * List out all sessions upcoming or past
 * @param upcoming True is upcoming. False is past
 * @param pos students, tutors, or admins
 * @param id OAuth ID (string)
 * @returns Array of sessions
 */
async function listSessions(upcoming: boolean, pos: string, id: string) {
  let operator = ''
  let userQuery = ''
  // Set the operator to check if before or after now
  if (upcoming) {
    operator = '>'
  } else {
    operator = '<'
  }
  // If looking for a specific users's id add extra query to check
  if (id != 'Any') {
    userQuery = ` AND ${pos}.id = '${id}'`
  }
  try {
    const res = await pool.query(
      `SELECT sessions.time_id, tutors.first_name as tutor_name, tutors.last_name as tutor_surname, 
      students.first_name as student_name, students.last_name as student_surname, sessions.subject_id, sessions.duration
      FROM sessions
      INNER JOIN tutors on sessions.tutor_id = tutors.id
      INNER JOIN students on sessions.student_id = students.id
      WHERE time_id ${operator} now() ${userQuery}
      ORDER BY time_id`
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

/**
 * Get a list of hours for tutors
 * @returns Array of tutors hours
 */
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

/**
 * Makes sure API key is valid
 * @param apiKey API Key
 * @returns User if API Key valid else nothing
 */
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

/**
 * Changes API Key on user request
 * @param id OAuth ID
 * @param apiKey
 */
function updateApiKey(id: string, apiKey: string) {
  pool
    .query('UPDATE admins SET api_key = $2::uuid WHERE id = $1', [id, apiKey])
    .catch((e) => console.error(e))
}

/**
 * Deletes tutors current term hours
 */
function advanceTerm() {
  pool.query('UPDATE tutors SET hours_term = 0').catch((e) => console.error(e))
}

/**
 * Increments grade of all accounts below grade 13
 */
function incrementGrade() {
  pool
    .query('UPDATE students SET grade = grade + 1 WHERE grade < 13')
    .catch((e) => console.error(e))
  pool
    .query('UPDATE tutors SET grade = grade + 1 WHERE grade < 13')
    .catch((e) => console.error(e))
  pool
    .query('UPDATE admins SET grade = grade + 1 WHERE grade < 13')
    .catch((e) => console.error(e))
}

/**
 * Removes users that have grade above 12
 * @param role students, tutors, admins
 */
function removeOldUsers(role: string) {
  pool
    .query(`DELETE FROM ${role} WHERE grade > 12`)
    .catch((e) => console.error(e))
}

/**
 * Creates the times for the week from the increments and holidays
 * @param week The sunday of the week that you would like to populate dates for
 */
async function createDates(week: Date) {
  try {
    let times = ''
    const inc = await pool.query(`SELECT hour from increments`)
    const holidays = await pool.query('SELECT holiday from holidays')
    // If there are increments loop through the days of the week and add the increments every day
    if (inc.rows.length != 0) {
      for (let i = 1; i < 6; i++) {
        for (let j = 0; j < inc.rows.length; j++) {
          const time = new Date(week)
          let holiday = false
          time.setDate(time.getDate() + i)
          for (let k = 0; k < holidays.rows.length; k++) {
            // If time is in holiday then set boolean true
            if (time.getDate() === holidays.rows[k].holiday.getDate()) {
              holiday = true
            }
          }
          // If not holiday add the time slot to the query
          if (!holiday) {
            time.setHours(inc.rows[j].hour, (inc.rows[j].hour % 1) * 60, 0, 0)
            times += "('" + new Date(time).toISOString() + "'),"
          }
        }
      }
      // Remove trailing comma in the query
      times = times.replace(/,$/, '')
      pool
        .query(
          `INSERT into times (time) VALUES ${times} ON CONFLICT DO NOTHING`
        )
        .catch((e) => console.error(e))
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * Creates a time slot
 * @param hour Hour in decimal format 0-23.75
 */
function createIncrement(hour: number) {
  pool
    .query('INSERT INTO increments (hour) VALUES ($1) ON CONFLICT DO NOTHING', [
      hour
    ])
    .catch((e) => console.error(e))
}

/**
 * List time slots
 * @returns Array of time slots
 */
async function listIncrements() {
  try {
    const res = await pool.query('SELECT hour FROM increments ORDER BY hour')
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

/**
 * Remove a time slot
 * @param hour Hour in decimal format 0-23.75
 */
function removeIncrement(hour: number) {
  pool
    .query('DELETE FROM increments WHERE hour = $1', [hour])
    .catch((e) => console.error(e))
}

/**
 * Create an off day
 * @param date Date (time doesn't matter) of off day
 */
function createHoliday(date: Date) {
  pool
    .query(
      'INSERT INTO holidays (holiday) VALUES ($1) ON CONFLICT DO NOTHING',
      [date]
    )
    .catch((e) => console.error(e))
}

/**
 * List off days
 * @returns Off days that are after now
 */
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

/**
 * Remove an off day
 * @param date Date (time doesn't matter) of off day
 */
function deleteHoliday(date: Date) {
  pool
    .query('DELETE FROM holidays WHERE holiday = $1', [date])
    .catch((e) => console.error(e))
}

/**
 * Create weekly availability options based on increments
 */
async function createWeeklyAvailability() {
  let string = ''
  const increments = await listIncrements()
  if (increments != undefined) {
    for (let i = 0; i < increments.length; i++) {
      for (let j = 1; j < 6; j++) {
        string += '(' + j + ',' + increments[i]['hour'] + '),'
      }
    }
    string = string.replace(/,$/, '')
    pool
      .query(
        `INSERT into weeklyavailability (dow,increment_id) VALUES ${string} ON CONFLICT DO NOTHING`
      )
      .catch((e) => console.error(e))
  }
}

/**
 * List weekly availability options
 * @returns Array of weekly availability dow and time
 */
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

/**
 * Add a tutor to a weekly availability slot
 * @param tid Tutor OAuth ID (string)
 * @param aid weekly availability ID
 */
function addTutorWeeklyAvailability(tid: string, aid: string) {
  pool
    .query(
      'INSERT INTO weeklyavailabilitymap (tutor_id,weeklyavailability_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [tid, aid]
    )
    .catch((e) => console.error(e))
}

/**
 * List what times of week a tutor is available
 * @param id Tutor OAuth ID (string)
 * @returns Array of weekly availability ids where tutor is available
 */
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

/**
 * List the weekly availability for a specific time of day
 * @param increment Increment to check
 * @returns Array of weeklyavailability
 */
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

/**
 * Provide data to allow migration from weekly to exact times
 * @returns Array of combined data from weeklyavailability and weeklyavailabilitymap
 */
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

/**
 * Migrate relative weekly times to exact times
 * @param week The sunday of the week that you would like to populate dates for
 * @returns Returns if weeklyAvailability doesn't exist
 */
async function migrateWeeklyToDates(week: Date) {
  const weeklyAvailability = await listWeeklyAvailabilityMap()

  if (weeklyAvailability == undefined || weeklyAvailability.length == 0) {
    return
  }

  let string = ''

  for (let i = 0; i < weeklyAvailability.length; i++) {
    const time = new Date(week)
    const increment = weeklyAvailability[i]['increment_id']
    // Some fun translation stuff
    time.setDate(time.getDate() + weeklyAvailability[i]['dow'])
    time.setHours(increment, (increment % 1) * 60, 0, 0)
    // Create the string to insert in to the database
    string +=
      "('" +
      new Date(time).toISOString() +
      "','" +
      weeklyAvailability[i]['tutor_id'] +
      "'),"
  }
  // Remove trailing comma
  string = string.replace(/,$/, '')

  pool
    .query(
      `INSERT INTO availabilitymap (time_id, tutor_id) VALUES ${string} ON CONFLICT DO NOTHING`
    )
    .catch((e) => console.error(e))
}

/**
 * Removes a tutor from a weekly availability slot
 * @param tid Tutor OAuth ID (string)
 * @param aid weekly availability ID
 */
function removeTutorWeeklyAvailability(tid: string, aid: string) {
  pool
    .query(
      'DELETE FROM weeklyavailabilitymap WHERE tutor_id = $1 AND weeklyavailability_id = $2',
      [tid, aid]
    )
    .catch((e) => console.error(e))
}

/**
 * Create a subject
 * @param string Preprocessed subject string
 */
function createSubject(string: string) {
  pool
    .query(
      `INSERT INTO subjects (subject) VALUES ${string} ON CONFLICT DO NOTHING`
    )
    .catch((e) => console.error(e))
}

/**
 * List subjects
 * @returns Array of subject names
 */
async function listSubjects() {
  try {
    const res = await pool.query('SELECT subject FROM subjects')
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

/**
 * Remove a subject
 * @param string Preprocessed subject string
 */
function removeSubject(string: string) {
  pool
    .query(`DELETE FROM subjects WHERE subject IN ${string}`)
    .catch((e) => console.error(e))
}

/**
 * Add a tutor to a subject
 * @param sid Subject ID
 * @param tid Tutor OAuthID (string)
 */
function addTutorsSubject(sid: string, tid: string) {
  pool
    .query(
      'INSERT INTO subjectmap (subject_id,tutor_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [sid, tid]
    )
    .catch((e) => console.error(e))
}

/**
 * List what subjects a tutor is able to tutor
 * @param id Tutor OAuthID (string)
 * @returns Array of subjects
 */
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

/**
 * Remove a tutor from a subject
 * @param sid Subject ID
 * @param tid Tutor OAuthID (string)
 */
function removeTutorsSubject(sid: string, tid: string) {
  pool
    .query('DELETE FROM subjectmap WHERE subject_id = $1 AND tutor_id = $2', [
      sid,
      tid
    ])
    .catch((e) => console.error(e))
}

/**
 * List all available time slots in db
 * @returns Array of time slots with extra data
 */
async function listAvailability() {
  try {
    const res = await pool.query(
      `SELECT availabilitymap.time_id, availabilitymap.tutor_id, tutors.first_name, tutors.last_name, subjectmap.subject_id
      FROM availabilitymap
      INNER JOIN subjectmap on availabilitymap.tutor_id = subjectmap.tutor_id
      INNER JOIN tutors on availabilitymap.tutor_id = tutors.id
      ORDER BY availabilitymap.tutor_id, availabilitymap.time_id`
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

/**
 * Remove old availability past current time
 */
async function purgeOldAvailability() {
  try {
    pool.query('DELETE FROM availabilitymap WHERE time_id < now()')
  } catch (err) {
    console.log(err)
  }
}

/**
 * NOT IN USE RIGHT NOW
 * List times available in between two dates
 * @param afterTime Later date
 * @param beforeTime Earlier date
 * @returns Array of times in between two dates
 */
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

/**
 * NOT IN USE RIGHT NOW
 * Lists the current times available this week
 * @returns Array of times for this week
 */
async function listCurrentWeekTimes() {
  const res = []
  const sun = functions.getSunday(new Date())
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

/**
 * NOT IN USE RIGHT NOW
 * List what times a tutor is available
 * @param id Tutor OAuth ID (string)
 * @returns Array of times where tutor is available
 */
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

/**
 * NOT IN USE RIGHT NOW
 * List all available time slots for a specific subject
 * @param subject Subject name
 * @returns Array of times available for select subject
 */
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
  createIncrement,
  listIncrements,
  removeIncrement,
  createHoliday,
  listHolidays,
  deleteHoliday,
  createWeeklyAvailability,
  listWeeklyAvailability,
  addTutorWeeklyAvailability,
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
  purgeOldAvailability,
  listTimesBetweenDates,
  listCurrentWeekTimes,
  listTutorAvailability,
  listAvailabilityForSubject
}
