import '../styles.scss'
import player from './player.js'
import search from './search.js'
import comments from './comments.js'

document.addEventListener('DOMContentLoaded', function () {
  search.init()
  player.init()
  comments.init()
})

