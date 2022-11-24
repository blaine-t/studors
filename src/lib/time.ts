import { format, add } from 'date-fns'

/**
 * Takes a date and the amount of hours between that date and the future date and creates a range
 * @param date Start time
 * @param duration Length of time in decimal hours
 * @returns Range string
 */
function formatRange(date: Date, duration: number) {
  const base = format(date, 'MMMM do ')
  let first = format(date, 'h:mm aa')
  const second = format(
    add(date, { hours: duration, minutes: (duration % 1) * 60 }),
    'h:mm aa'
  )
  if (first.slice(-2) === second.slice(-2)) {
    first = first.slice(0, -2)
  }
  return base + first + ' - ' + second
}

export default {
  formatRange
}
