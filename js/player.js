const player = new Audio()
const clientID = 'client_id=27e7671d4d1784ed5d35d34922e136d8'

let progressAnimationFrame

const init = function () {
  interactions()
  events()
}

const interactions = function () {
  document.querySelector('.controlls').addEventListener('click', togglePlay)
  document.querySelector('.progress').addEventListener('click', changeTime)
  document.querySelector('.track').addEventListener('click', pause)
}

const play = function () {
  player.play()
}

const pause = function () {
  if (!player.currentTime) return
  player.pause()
}

const togglePlay = function () { !player.paused ? pause() : play() }

const events = function () {
  player.addEventListener('playing', statePlaying)
  player.addEventListener('pause', statePaused)
}

const changeTime = function (e) {
  if (!player.currentTime) return
  if (player.paused) play()
  var x = e.pageX - this.offsetLeft
  player.currentTime = convertRange(x, [0, this.offsetWidth], [0, player.duration])
  stateLoading()
}

const stateLoading = function () {
  const iconElm = document.querySelector('.controlls')
  iconElm.classList.add('--blink')
  if (!iconElm.classList.contains('--play') || !iconElm.classList.contains('--pause')) {
    iconElm.classList.add('--play')
  }
}

const statePlaying = function () {
  const iconElm = document.querySelector('.controlls')
  iconElm.classList.remove('--blink')
  iconElm.classList.remove('--play')
  iconElm.classList.add('--pause')
  updateProgressBar()
  updateCurrentTime()
}

const statePaused = function () {
  const iconElm = document.querySelector('.controlls')
  iconElm.classList.add('--play')
  iconElm.classList.remove('--pause')
  stopProgress()
}

const stopProgress = function () {
  cancelAnimationFrame(progressAnimationFrame)
  clearTimeout(currentTimeInterval)
}

var convertRange = function (value, r1, r2) {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0]
}

let progressBarElm = null
let currentTimeElm = null
let currentTimeInterval

const updateCurrentTime = function () {
  currentTimeElm = currentTimeElm || document.querySelector('.time.current')
  const update = function () {
    const currentTime = player.currentTime
    currentTimeElm.innerHTML = toHHMMSS(currentTime)
    currentTimeInterval = setTimeout(update, 1000)
  }
  update()
}

const updateProgressBar = function () {
  progressBarElm = progressBarElm || document.querySelector('.progressBar')
  const currentTime = player.currentTime
  const duration = player.duration
  const scaleX = convertRange(currentTime, [0, duration], [1, 0])
  progressBarElm.style.transform = 'scaleX(' + scaleX + ')'
  progressAnimationFrame = requestAnimationFrame(updateProgressBar)
}

const playTrack = function (data, timestamp) {
  stopProgress()
  player.pause()
  progressBarElm = progressBarElm || document.querySelector('.progressBar')
  const scaleX = convertRange(timestamp, [0, data.duration / 1000], [1, 0])
  progressBarElm.style.transform = 'scaleX(' + scaleX + ')'
  player.src = data.stream_url + '?' + clientID
  player.currentTime = timestamp
  play()

  updateTrackInfo(data, timestamp)
}

const updateTrackInfo = function (data, timestamp) {
  const coverElm = document.querySelector('.cover')
  const titleElm = document.querySelector('.title')
  const artistElm = document.querySelector('.artist')
  const linkElm = document.querySelector('.track')
  const totalTimeElm = document.querySelector('.time.total')
  const currentTimeElm = document.querySelector('.time.current')
  linkElm.href = data.permalink_url + '#t=' + toHHMMSS(timestamp)
  coverElm.style.backgroundImage = 'url(' + data.artwork_url + ')'
  totalTimeElm.innerHTML = toHHMMSS(data.duration / 1000)
  currentTimeElm.innerHTML = toHHMMSS(timestamp)
  titleElm.innerHTML = data.title
  artistElm.innerHTML = data.user.username
}

const reset = function () {
  pause()
  const coverElm = document.querySelector('.cover')
  const titleElm = document.querySelector('.title')
  const artistElm = document.querySelector('.artist')
  const linkElm = document.querySelector('.track')
  const progressBarElm = document.querySelector('.progressBar')
  const totalTimeElm = document.querySelector('.time.total')
  const currentTimeElm = document.querySelector('.time.current')
  linkElm.href = ''
  coverElm.style.backgroundImage = ''
  artistElm.innerHTML = ''
  titleElm.innerHTML = ''
  totalTimeElm.innerHTML = ''
  currentTimeElm.innerHTML = 'Loading...'
}

var toHHMMSS = (secs) => {
  var secNum = parseInt(secs, 10)
  var hours = Math.floor(secNum / 3600) % 24
  var minutes = Math.floor(secNum / 60) % 60
  var seconds = secNum % 60
  return [hours, minutes, seconds]
        .map(v => v < 10 ? '0' + v : v)
        .filter((v, i) => v !== '00' || i > 0)
        .join(':')
}

export default {
  init,
  player,
  playTrack,
  stateLoading,
  reset
}
