import moment from 'moment'

export default function formatTime(time) {
  const inputDate = new Date(time)
  return moment(inputDate).fromNow()
}
