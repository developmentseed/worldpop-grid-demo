var chroma = require('chroma-js')
var mapboxLight = require('./mapbox-light.json')

mapboxLight.layers.forEach(function (layer) {
  layer.interactive = false
})

module.exports = function (property) {
  var scale = chroma.scale('Spectral').domain([1200, 0], 'log')

  var stops = []
  for (var i = 0; i < 30; i++) { stops.push((i + 1) / 30 * 1200) }

  var style = {
    'version': 8,
    'name': 'Basic',
    'sources': {
      'mapbox': {
        'type': 'vector',
        'url': 'mapbox://mapbox.mapbox-streets-v6'
      },
      'mapbox://mapbox.mapbox-terrain-v2': {
        'url': 'mapbox://mapbox.mapbox-terrain-v2',
        'type': 'vector'
      },
      'worldpop': {
        'type': 'vector',
        'url': 'mapbox://devseed.adf1okaz'
      }
    },
    'sprite': 'mapbox://sprites/devseed/cife4hfep6f88smlxfhgdmdkk',
    'glyphs': 'mapbox://fonts/devseed/{fontstack}/{range}.pbf',
    'layers': mapboxLight.layers
  }

  // Dynamically generate a set of layers that mimic data-driven styling.
  // This set of layers is like a color scale: it selects features with the
  // appropriate data values with `filter`, and then styles them with the
  // approprieate `fill-opacity`.
  stops = [].concat(stops)
  stops.sort(function (a, b) { return a - b })
  for (i = 0; i < stops.length - 1; i++) {
    var filters = []
    if (i > 0) {
      filters.push([ '>', property, stops[i] ])
    }
    if (i < stops.length - 1) {
      filters.push([ '<=', property, stops[i + 1] ])
    }
    var color = scale(stops[i + 1]).hex()

    console.log(color, JSON.stringify(filters))

    style.layers.push({
      'id': 'population-' + i,
      'interactive': true,
      'type': 'fill',
      'source': 'worldpop',
      'source-layer': 'population',
      'paint': {
        'fill-color': color,
        'fill-opacity': 0.5
      },
      'filter': [ 'all' ].concat(filters).concat([[ '<', property, 5000 ]])
    })
  }

  return style
}
