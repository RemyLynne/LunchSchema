export function getMonthBounds(offset = 0, now = new Date()) {
  const year = now.getFullYear()
  const month = now.getMonth() + offset
  return {
    firstOfMonth: new Date(year, month, 1).getDate(),
    lastOfMonth: new Date(year, month + 1, 0).getDate(),
    month: month,
    year: year,
  }
}

export function countWeekdayInMonth(weekday: number, offset = 0, now = new Date()) {
  const { firstOfMonth, lastOfMonth } = getMonthBounds(offset, now)
  const daysInMonth = lastOfMonth
  const firstOccurrence = 1 + ((weekday - firstOfMonth + 7) % 7)
  return Math.floor((daysInMonth - firstOccurrence) / 7) + 1
}