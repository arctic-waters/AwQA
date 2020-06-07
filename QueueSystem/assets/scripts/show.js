require([
  'esri/Map',
  'esri/views/MapView',
  'esri/Graphic',
  'esri/geometry/Point',
  'esri/geometry/SpatialReference',
], function (Map, MapView, Graphic, Point, SpatialReference) {
  var map = new Map({
    basemap: 'streets-navigation-vector',
  })

  var view = new MapView({
    container: 'viewDiv',
    map: map,
    center: [-122.980507, 49.24881],
    zoom: 12,
  })

  view.graphics.add(
    new Graphic({
      symbol: {
        type: 'simple-marker',
        color: 'white',
        size: '8px',
      },
      geometry: new Point(
        point[0],
        point[1],
        new SpatialReference({
          wkid: 102100,
        })
      ),
    })
  )
})
