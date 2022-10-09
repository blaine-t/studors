import { Pool } from 'pg'
// Pulls connection info from .env variables. See: https://node-postgres.com/features/connecting
const pool = new Pool()

async function createUser(
  role: string,
  id: string,
  first_name: string,
  last_name: string,
  picture: string,
  email: string
) {
  pool.query(
    `INSERT INTO ${role} (id,first_name,last_name,picture,email) VALUES ($1,$2,$3,$4,$5)`,
    [id, first_name, last_name, picture, email.toLowerCase()],
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}

async function updateUser(
  role: string,
  id: string,
  phone: string,
  grade: number,
  dark_theme: boolean
) {
  pool.query(
    `UPDATE ${role} SET phone = $2, grade = $3, dark_theme = $4 WHERE id = $1`,
    [id, phone, grade, dark_theme],
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}

async function deleteUser(role: string, id: string) {
  pool.query(`DELETE FROM ${role} WHERE id = $1`, [id], (err) => {
    if (err) {
      console.log(err)
    }
  })
}

async function authUser(role: string, id: string) {
  try {
    const res = await pool.query(`SELECT * FROM ${role} WHERE id = $1`, [id])
    return res.rows[0]
  } catch (err) {
    console.log(err)
  }
}

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

async function allowUser(role: string, email: string) {
  pool.query(
    `INSERT INTO allowed${role} (email) VALUES ${email} ON CONFLICT DO NOTHING`,
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}

async function revokeUser(role: string, email: string) {
  pool.query(`DELETE FROM allowed${role} WHERE email IN ${email}`, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

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

async function createSession(
  sid: string,
  tid: string,
  time: Date,
  subject: string
) {
  pool.query(
    'INSERT INTO sessions (student_id,tutor_id,time_id,subject_id) VALUES ($1,$2,$3,$4)',
    [sid, tid, time, subject],
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}

async function updateApiKey(id: string, apiKey: string) {
  pool.query(
    'UPDATE admins SET api_key = $2::uuid WHERE id = $1',
    [id, apiKey],
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}

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

async function truncateTable(table: string) {
  pool.query(`TRUNCATE TABLE ${table} CASCADE`, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

async function incrementGrade() {
  pool.query(
    'UPDATE students SET grade = grade + 1 WHERE grade < 13',
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
  pool.query('UPDATE tutors SET grade = grade + 1 WHERE grade < 13', (err) => {
    if (err) {
      console.log(err)
    }
  })
  pool.query('UPDATE admins SET grade = grade + 1 WHERE grade < 13', (err) => {
    if (err) {
      console.log(err)
    }
  })
}

async function removeOldUsers(role: string) {
  pool.query(`DELETE FROM ${role} WHERE grade > 12`, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

async function advanceTerm() {
  pool.query('UPDATE tutors SET hours_term = 0', (err) => {
    if (err) {
      console.log(err)
    }
  })
}

function getSunday(date = new Date()) {
  const previousSunday = new Date()

  previousSunday.setDate(date.getDate() - date.getDay())

  previousSunday.setHours(0, 0, 0, 0)

  return previousSunday
}

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
            times += "('" + new Date(time).toISOString() + ")'),"
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

async function listCurrentDatesWeek() {
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

async function listIncrements() {
  try {
    const res = await pool.query('SELECT hour FROM increments')
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

async function createHoliday(date: Date) {
  pool.query('INSERT INTO holidays (holiday) VALUES ($1)', [date], (err) => {
    if (err) {
      console.log(err)
    }
  })
}

async function deleteHoliday(date: Date) {
  pool.query('DELETE FROM holidays WHERE holiday = $1', [date], (err) => {
    if (err) {
      console.log(err)
    }
  })
}

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

export default {
  createUser,
  updateUser,
  deleteUser,
  authUser,
  checkUser,
  allowUser,
  revokeUser,
  listUsers,
  listAllowed,
  listSessions,
  createSession,
  updateApiKey,
  confirmApiKey,
  getHours,
  truncateTable,
  incrementGrade,
  removeOldUsers,
  advanceTerm,
  createDates,
  listTimesBetweenDates,
  listCurrentDatesWeek,
  listIncrements,
  createHoliday,
  deleteHoliday,
  listHolidays,
  listTutorAvailability,
  createWeeklyAvailability
}
