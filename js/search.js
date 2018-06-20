import autoComplete from 'js-autocomplete'
import soundcloudRequest from './soundcloud-request.js'
import comments from './comments.js'

let inputElm
let xhr

const renderUser = function (item, search) {
  return '<div class="autocomplete-suggestion" data-id="' + item.id + '"><div style="background-image: url(' + item.avatar_url + ')"class="profilepic"></div><span class="username">' + item.username + '<span></div>'
}
const userSelected = function (e, term, item) {
  const id = item.getAttribute('data-id')
  setInputValue(item.innerText)
  soundcloudRequest('users/' + id + '/comments').then(comments.append)
}

const searchSoundcloud = function (term, response) {
  try { xhr.abort() } catch (e) {}
  soundcloudRequest('users/?q=' + term).then(function (data) {
    response(data)
  })
}

const setInputValue = function (string) {
  inputElm.value = string
}

const init = function () {
  inputElm = document.querySelector('.search input')
  var parsedUrl = new URL(window.location.href)
  const id = parsedUrl.searchParams.get('user')
  if (id) {
    soundcloudRequest('users/' + id + '/comments').then(comments.append)
    soundcloudRequest('users/' + id).then(function (data) { setInputValue(data.username) })
  }

  new autoComplete({
    selector: 'input[name="user"]',
    source: searchSoundcloud,
    renderItem: renderUser,
    onSelect: userSelected
  })
}

export default {
  init
}
