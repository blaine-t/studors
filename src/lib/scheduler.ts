import schedule from 'node-schedule'
import db from './db'
import functions from './functions'

/**
 * At 1700 on Monday of every week generate this weeks and next weeks schedule
 */
function scheduleDates() {
  schedule.scheduleJob('0 17 * * 1', function () {
    const currentDate = new Date()
    const nextWeekDate = new Date()
    nextWeekDate.setDate(currentDate.getDate() + 7)
    db.createDates(functions.getSunday(currentDate))
    db.createDates(functions.getSunday(nextWeekDate))
    db.migrateWeeklyToDates(functions.getSunday(currentDate))
    db.migrateWeeklyToDates(functions.getSunday(nextWeekDate))
  })
}

/**
 * Every 15 minutes during the weekdays purge old times
 */
function purgeOldDates() {
  schedule.scheduleJob('*/15 * * * 1-5', function () {
    db.purgeOldAvailability()
  })
}

export default {
  scheduleDates,
  purgeOldDates
}
