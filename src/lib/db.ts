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
    [id, first_name, last_name, picture, email],
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

async function updateStudent(
  id: string,
  phone: string,
  grade: number,
  dark_theme: boolean
) {
  pool.query(
    'UPDATE students SET phone = $2, grade = $3, dark_theme = $4 WHERE id = $1',
    [id, phone, grade, dark_theme],
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}

async function updateTutor(
  id: string,
  phone: string,
  grade: number,
  subjects: string[],
  availability: Date[],
  dark_theme: boolean
) {
  pool.query(
    'UPDATE tutors SET phone = $2, grade = $3, subjects = $4, availability = $5, dark_theme = $6 WHERE id = $1',
    [id, phone, grade, subjects, availability, dark_theme],
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}

async function updateAdmin(id: string, phone: string, dark_theme: boolean) {
  pool.query(
    'UPDATE admins SET phone = $2, dark_theme = $3 WHERE id = $1',
    [id, phone, dark_theme],
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
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
  pool.query(`INSERT INTO allowed${role} (email) VALUES ${email}`, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

async function revokeUser(role: string, email: string) {
  pool.query(`DELETE FROM allowed${role} WHERE email = ${email}`, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

async function listUsers(role: string) {
  try {
    const res = await pool.query(`SELECT email FROM ${role} ORDER BY email`)
    let returnStatement = ''
    for (let i = 0; i < res.rows.length; i++) {
      returnStatement += res.rows[i]['email'] + '\n'
    }
    return returnStatement
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
      `SELECT sessions.timeof, tutors.first_name as tutor_name, tutors.last_name as tutor_surname, 
      students.first_name as student_name, students.last_name as student_surname, sessions.subject, sessions.hours
      FROM sessions
      INNER JOIN tutors on sessions.tutor_id = tutors.id
      INNER JOIN students on sessions.student_id = students.id
      WHERE timeof ${operator} now()
      ORDER BY timeof`
    )
    return res.rows
  } catch (err) {
    console.log(err)
  }
}

async function createSession(sid: string, tid: string, time: Date) {
  pool.query(
    'INSERT INTO sessions (student_id,tutor_id,timeof) VALUES ($1,$2,$3)',
    [sid, tid, time],
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
  pool.query('UPDATE students SET grade = grade + 1', (err) => {
    if (err) {
      console.log(err)
    }
  })
  pool.query('UPDATE tutors SET grade = grade + 1', (err) => {
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

export default {
  createUser,
  updateStudent,
  updateTutor,
  updateAdmin,
  deleteUser,
  authUser,
  checkUser,
  allowUser,
  revokeUser,
  listUsers,
  listSessions,
  createSession,
  confirmApiKey,
  getHours,
  truncateTable,
  incrementGrade,
  removeOldUsers
}
