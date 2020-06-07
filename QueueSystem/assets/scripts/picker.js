require(['esri/Map', 'esri/views/MapView', 'esri/Graphic'], function (
  Map,
  MapView,
  Graphic
) {
  var map = new Map({
    basemap: 'streets-navigation-vector',
  })

  var view = new MapView({
    container: 'viewDiv',
    map: map,
    center: [-122.980507, 49.24881],
    zoom: 12,
  })

  view.on('click', function (event) {
    if (view.graphics.length !== 0) view.graphics.removeAll()

    document.getElementById('locX').value = '' + event.mapPoint.x
    document.getElementById('locY').value = '' + event.mapPoint.y

    addGraphic(event.mapPoint)
  })

  function addGraphic(point) {
    var graphic = new Graphic({
      symbol: {
        type: 'simple-marker',
        color: 'white',
        size: '8px',
      },
      geometry: point,
    })
    view.graphics.add(graphic)
  }
})
