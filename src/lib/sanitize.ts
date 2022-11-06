/**
 * Checks to make sure phone is valid and clean it if it's just missing formatting
 * @param phone String to sanitize
 * @returns valid returned if clean false if not
 */
function phone(phone: string) {
  phone = phone.replace(/\D/g, '')
  if (phone.length === 10) {
    phone =
      '(' +
      phone.slice(0, 3) +
      ') ' +
      phone.slice(3, 6) +
      '-' +
      phone.slice(6, 10)
    if (
      phone.match(
        '^[(]?([2-9][0-8][0-9])[)]?[-|\\s]?([2-9][0-9]{2})[-|\\s]?([0-9]{4})$'
      )
    ) {
      return phone
    }
    return false
  } else if (phone.length === 0) {
    return ''
  } else {
    return false
  }
}

/**
 * Check to make sure that the pos string is in the approved list
 * @param pos String to sanitize
 * @returns True if clean false if not
 */
function pos(pos: string) {
  const posArray = ['student', 'tutor', 'admin']
  if (posArray.includes(pos)) {
    return true
  }
  return false
}

/**
 * Checks to make sure OAuth ID is just a string of numbers
 * @param id String to sanitize
 * @returns True if clean false if not
 */
function id(id: string) {
  if (id.match('^[0-9]*$')) {
    return true
  }
  return false
}

/**
 * Check if grade is in the right values for given role
 * @param grade String to sanitize
 * @param role student, tutor, admin
 * @returns True if clean false if not
 */
function grade(grade: string, role: string) {
  if (grade.match('[9]') || grade.match('[1][0-2]')) {
    return true
  } else if (grade.match('13') && role === 'admin') {
    return true
  }
  return false
}

function boolean(boolean: unknown) {
  if (typeof boolean === 'boolean') {
    return true
  }
  return false
}

export default {
  phone,
  pos,
  id,
  grade,
  boolean
}
