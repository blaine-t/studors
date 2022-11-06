/**
 * Gets the Sunday of given day in a week
 * @param date Day of a week
 * @returns Sunday of that week
 */
function getSunday(date: Date) {
  const previousSunday = new Date()

  previousSunday.setDate(date.getDate() - date.getDay())

  previousSunday.setHours(0, 0, 0, 0)

  return previousSunday
}

export default {
  getSunday
}
