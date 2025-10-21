let lastUpdate = new Date()

export function updateServerDate() {
  lastUpdate = new Date()
}

export default defineEventHandler(() => {
  return { lastUpdate }
})