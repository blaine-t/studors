import { Pool } from 'pg'
// Pulls connection info from .env variables. See: https://node-postgres.com/features/connecting
const pool = new Pool()

//TODO: PROPERLY ADD FUNCTIONS

function test() {
  pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
  })
}

async function addStudent(
  id: string,
  firstName: string,
  lastName: string,
  pic: string,
  email: string
) {
  console.log(id, firstName, lastName, pic, email)
}

async function authStudent(id: string) {
  if (id != null) {
    return true
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
  test,
  addStudent,
  authStudent,
  confirmApiKey,
  getHours
}
