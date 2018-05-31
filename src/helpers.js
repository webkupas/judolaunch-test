export const currentDate = () => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let date = new Date()
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
}
export const currentTime = () => {
  let date = new Date()
  let hours = ('0' + date.getHours()).substr(-2)
  let mins = ('0' + date.getMinutes()).substr(-2)
  let secs = ('0' + date.getSeconds()).substr(-2)
  return `${hours}:${mins}:${secs}`
}
export const currentDateCode = () => {
  let date = new Date()
  let day = ('0' + date.getDate()).substr(-2)
  let month = ('0' + (date.getMonth()+1) ).substr(-2)
  let year = date.getFullYear() 
  return `d${year}${month}${day}`
}