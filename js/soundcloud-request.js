const clientID = 'client_id=27e7671d4d1784ed5d35d34922e136d8'

module.exports = function (endpoint) {
  const connector = endpoint.includes('?') ? '&' : '?'
  const url = 'https://api.soundcloud.com/' + endpoint + connector + clientID
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        resolve(JSON.parse(request.responseText))
      } else {
        reject()
      }
    }
    request.send()
  })
}
