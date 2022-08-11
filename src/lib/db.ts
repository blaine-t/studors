import { Pool } from 'pg'
// Pulls connection info from .env variables. See: https://node-postgres.com/features/connecting
const pool = new Pool()

//TODO: PROPERLY ADD FUNCTIONS

async function createUser(
  role: string,
  id: string,
  first_name: string,
  last_name: string,
  picture: string,
  email: string
) {
  pool.query(
    `INSERT INTO ${role}(id,first_name,last_name,picture,email) VALUES ($1,$2,$3,$4,$5)`,
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

async function confirmApiKey(apiKey: string) {
  if (apiKey != null) {
    return true
  }
}

async function getHours() {
  return true
}

export default {
  createUser,
  updateStudent,
  updateTutor,
  updateAdmin,
  deleteUser,
  authUser,
  confirmApiKey,
  getHours
}
