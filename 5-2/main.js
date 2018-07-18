$("#map").width("100%")
$("#map").height("600px")

const basemap = {
    "URL": "http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png",
    "attribution": "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA."
  }

var base = new L.TileLayer(basemap.URL, {
  attribution: basemap.attribution,
  maxZoom: 15,
  minZoom: 8
});

var map = new L.Map('map', {layers: [base], center: new L.LatLng(35.7000, 139.430), zoom: 10});
L.svg().addTo(map)


d3.json("13201.geojson").then(function(geom){
  console.log(geom)

  function projectPoint(x, y){
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }
  var transform = d3.geoTransform({point: projectPoint});
  var path = d3.geoPath().projection(transform);
  function update(d){
    d3.select(this).attr("d", path)
  }

  d3.select("svg").selectAll("path")
    .data(geom.features)
    .enter()
    .append("path")
    .attr("fill", function(d, i){
      return "hsl(0, 100%, 50%)";
    })
    .attr("opacity", 0.5)
    .attr("stroke", "white")
    .each(update)

  map.on('move', function(d){
    d3.selectAll("path").each(update);
    var mapcenter = map.getCenter()
    var point = map.latLngToLayerPoint(mapcenter)
  });
})
