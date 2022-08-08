import db from './db'

async function acceptHoursRequest(apiKey: string) {
  if (apiKey === undefined) {
    return { user: 'UNAUTHORIZED' }
  }
  if ((await db.confirmApiKey(apiKey)) != null) {
    return await db.getHours()
  } else {
    return { user: 'UNAUTHORIZED' }
  }
}

export default {
  acceptHoursRequest
}
