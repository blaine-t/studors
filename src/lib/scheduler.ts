import schedule from 'node-schedule'
import db from './db'
import functions from './functions'

function scheduleDates() {
  schedule.scheduleJob('0 17 * * 1', function () {
    db.createDates(functions.getSunday()) // Fix later
    db.migrateWeeklyToDates(functions.getSunday()) // Fix later
  })
}

function purgeOldDates() {
  schedule.scheduleJob('*/15 * * * 1-5', function () {
    db.purgeOldAvailability()
  })
}

export default {
  scheduleDates,
  purgeOldDates
}
