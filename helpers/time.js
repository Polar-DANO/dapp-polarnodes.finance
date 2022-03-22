export default {
  timeConverter (unixTimestamp) {
    const a = new Date(unixTimestamp * 1000)
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const year = a.getFullYear()
    const month = months[a.getMonth()]
    const date = a.getDate()
    const hour = a.getHours()
    const min = a.getMinutes()
    const sec = a.getSeconds()
    const time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec
    return time
  }
}
