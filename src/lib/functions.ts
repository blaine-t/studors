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

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export default {
  getSunday,
  toTitleCase
}
