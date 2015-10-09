var mapboxgl = require('mapbox-gl')
// var Draw = require('gl-draw')
var validate = require('mapbox-gl-style-spec').validate
var makeStyle = require('./style')

var qs = require('querystring')
var query = qs.parse(window.location.search.substring(1))
mapboxgl.accessToken = query.access_token

var errors = document.getElementById('errors')

document.addEventListener('DOMContentLoaded', function () {
  // Initialize the map
  var stylesheet = makeStyle('densitypph')
  console.log(stylesheet)
  if (!validateStyle(stylesheet)) { return }
  var map = new mapboxgl.Map({
    container: 'map',
    style: stylesheet,
    center: [32.5782, 0.2948],
    zoom: 13,
    hash: true
  })

  window.glmap = map

  // var draw = Draw()
  // map.addControl(draw)

  map.on('load', function () {
    console.log('map loaded')
  })
  // Track mouse movements, use it to look up the feature properties from the
  // vector tiles underneath the mouse
  var follow = true
  map.on('mousemove', function (e) {
    if (!follow) return
    map.featuresAt(e.point, { includeGeometry: false }, function (err, features) {
      console.log(err, features)
      if (err) throw err
      var data = features
      .map(function (f) { return f.properties.densitypph })
      .map(function (f) { return f.toFixed(2) })
      .join(', ')

      if (data.trim().length) {
        document.querySelector('#data').innerHTML = 'pph: ' + data
      }
    })
  })

  // map.on('click', function () {
  //   follow = !follow
  //   document.querySelector('#features').classList.toggle('follow')
  // })
})

function validateStyle (stylesheet) {
  // validate the stylesheet (useful for development purposes)
  var valid = validate(JSON.stringify(stylesheet))
  if (valid.length) {
    errors.style.display = 'block'
    errors.appendChild(document.createElement('h2')).innerHTML = 'Style Validation Error'
    valid.forEach(function (e) {
      errors.appendChild(document.createElement('p')).innerHTML = e.message
      console.error(e)
    })
    return false
  }
  return true
}

