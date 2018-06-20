import sentinel from 'sentinel-js'
import hrt from 'human-readable-time'
import hbs from 'handlebars'
import soundcloudRequest from './soundcloud-request.js'
import player from './player.js'

const clearComments = function () { document.querySelector('.comments').innerHTML = '' }

const playComment = function (id, timestampMilli) {
  player.reset()
  const timestamp = timestampMilli / 1000
  player.stateLoading()
  soundcloudRequest('tracks/' + id).then(function (data) {
    player.playTrack(data, timestamp)
  })
}

const showEmptyMessage = function (show, wrapper) {
  show ? wrapper.classList.add('--empty') : wrapper.classList.remove('--empty')
}

const append = function (comments) {
  const wrapper = document.querySelector('.comments')

  clearComments()
  const isEmpty = comments.length === 0
  if (isEmpty) {
    window.history.pushState({}, '', '/')
    showEmptyMessage(true, wrapper)
    return
  }
  showEmptyMessage(false, wrapper)
  window.history.pushState({}, 'User', '?user=' + comments[0].user_id)
  const templateScript = document.querySelector('#template-comment').innerHTML
  const template = hbs.compile(templateScript)

  for (var comment of comments) {
    let compiledTemplate = template({
      'time': hrt(new Date(comment.created_at), '%relative% ago'),
      'text': comment.body,
      'timestamp': comment.timestamp,
      'track_id': comment.track_id
    })
    wrapper.insertAdjacentHTML('beforeend', compiledTemplate)
  }
}

const init = function () {
  sentinel.on('.comment', function (comment) {
    comment.addEventListener('click', function () {
      statusActive(this)
      playComment(comment.dataset.track, comment.dataset.timestamp)
    })
  })
}

const statusActive = function (elm) {
  const comments = document.querySelectorAll('.comment')
  for (var comment of comments) {
    comment.classList.remove('--active')
  }
  elm.classList.add('--active')
}

export default {
  init,
  append
}
