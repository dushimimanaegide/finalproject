export function getDateRangeFromFilter(filter: string, fromDate?: string, toDate?: string) {
  const now = new Date()
  let startDate: Date | undefined
  let endDate: Date | undefined

  switch (filter) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0))
      endDate = new Date(now.setHours(23, 59, 59, 999))
      break

    case "yesterday":
      startDate = new Date(now)
      startDate.setDate(startDate.getDate() - 1)
      startDate.setHours(0, 0, 0, 0)

      endDate = new Date(startDate)
      endDate.setHours(23, 59, 59, 999)
      break

    case "this-week":
      startDate = new Date(now)
      startDate.setDate(startDate.getDate() - startDate.getDay()) // Start of week (Sunday)
      startDate.setHours(0, 0, 0, 0)

      endDate = new Date(now)
      endDate.setHours(23, 59, 59, 999)
      break

    case "this-month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now)
      endDate.setHours(23, 59, 59, 999)
      break

    case "custom":
      if (fromDate) {
        startDate = new Date(fromDate)
        startDate.setHours(0, 0, 0, 0)
      }

      if (toDate) {
        endDate = new Date(toDate)
        endDate.setHours(23, 59, 59, 999)
      }
      break

    default: // "all"
      // No date filtering
      break
  }

  return { startDate, endDate }
}
