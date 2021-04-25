import moment from 'moment'
import wordFormat from './wordFormat'

export default (dateStart, dateEnd = new Date()) => {
  moment.locale('ru')
  const start = dateStart instanceof Date ? dateStart : new Date(dateStart)

  const difference = moment.duration(moment(dateEnd).diff(moment(start)))

  const years = Math.floor(difference.asYears())
  const months = Math.floor(difference.add(-years, 'years').asMonths())
  const days = Math.floor(difference.add(-months, 'months').asDays())
  const result = []
  if (years)
    result.push(`${years} ${wordFormat(years, ['год', 'года', 'лет'])}`)
  if (months)
    result.push(
      `${months} ${wordFormat(months, ['месяц', 'месяца', 'месяцев'])}`
    )
  if (days) result.push(`${days} ${wordFormat(days, ['день', 'дня', 'дней'])}`)
  return result.join(' ')
}
