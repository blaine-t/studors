/**
 * Convert a string to capital casing
 * @param str String to convert
 * @returns Capital string
 */
function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export default {
  toTitleCase
}
