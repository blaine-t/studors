import db from './db'
import sanitize from './sanitize'

/**
 * Checks if the user's API Key is supplied, a string, and valid in the DB
 * @param apiKey API Key the user gives in POST request to API endpoint
 * @returns Response to send user in JSON
 */
async function acceptHoursRequest(apiKey: string) {
  //Checks if API key is not a string and then tells user invalid type
  if (typeof apiKey !== 'string') {
    // If API key is undefined then tell user to supply one
    if (apiKey === undefined) {
      return { supply: 'API KEY' }
    }
    return { invalid: 'TYPE' }
  }
  if (!sanitize.apiKey(apiKey)) {
    return { invalid: 'FORMAT' }
  }
  // Return the hours of tutors if valid key
  if ((await db.confirmApiKey(apiKey)) != null) {
    return await db.getHours()
  }
  // If API key is supplied but isn't valid report unauthorized
  return { user: 'UNAUTHORIZED' }
}

export default {
  acceptHoursRequest
}
