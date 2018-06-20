import './styles.scss'
import player from './js/player.js'
import search from './js/search.js'
import comments from './js/comments.js'

document.addEventListener('DOMContentLoaded', function () {
  search.init()
  player.init()
  comments.init()
})

