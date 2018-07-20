$("#map").width("100%")
$("#map").height("600px")

const basemap = {
  "URL": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
  "attribution": "&copy; OpenStreetMap contributors"
  }

var base = new L.TileLayer(basemap.URL, {
  attribution: basemap.attribution,
  maxZoom: 15,
  minZoom: 8
});

var map = new L.Map('map', {layers: [base], center: new L.LatLng(35.7000, 139.430), zoom: 10});
L.svg().addTo(map)

//統計データ読み込み
d3.json("13201.geojson").then(function(geom){
  console.log(geom)

  //境界データを地図上に表示するための関数定義
  function projectPoint(x, y){
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }
  var transform = d3.geoTransform({point: projectPoint});
  var path = d3.geoPath().projection(transform);
  function update(d){
    d3.select(this).attr("d", path)
  }

  //境界データ描画
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

  //地図移動時に境界データも一緒に移動させる処理
  map.on('move', function(d){
    d3.selectAll("path").each(update);
  });
})
