$("#map").width("100%")
$("#map").height("600px")

const basemap = {
  "URL": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
  "attribution": "&copy; OpenStreetMap contributors"
  };

var base = new L.TileLayer(basemap.URL, {
  attribution: basemap.attribution,
  maxZoom: 15,
  minZoom: 8
});

var map = new L.Map('map', {layers: [base], center: new L.LatLng(35.7000, 139.430), zoom: 10});
L.svg().addTo(map);

//統計データ読み込み
d3.json("13201.geojson").then(function(geom){
  d3.json("data2.json").then(function(myData){
    console.log(geom);

    //値に応じた色付け手法定義
    var hueScale = 0
    function calcScale(){
      var dataset = [];
      for(var key in myData){
        if(myData[key]["TOTAL"] != "NA"){
          dataset.push(myData[key]["TOTAL"]);
        }
      };
      var maxVal = Math.max.apply(null, dataset);
      var minVal = Math.min.apply(null, dataset);
      hueScale = d3.scaleLinear()
        .domain([maxVal, minVal])
        .range([0, 100]);
    };


    //境界データを地図上に表示するための関数定義
    function projectPoint(x, y){
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    };
    var transform = d3.geoTransform({point: projectPoint});
    var path = d3.geoPath().projection(transform);
    function update(d){
      d3.select(this).attr("d", path);
    };

    calcScale();

    //境界データ描画
    d3.select("svg").selectAll("path")
      .data(geom.features)
      .enter()
      .append("path")
      .attr("fill", function(d, i){
        return "hsl(0, 100%, 0%)";
      })
      .attr("opacity", 0.5)
      .attr("stroke", "white")
      .each(update)
      .transition()
      .duration(1000)
      .attr("fill", function(d, i){
        if(myData[d.properties.KEY_CODE]["TOTAL"] != "NA"){
          return "hsl("+ hueScale(myData[d.properties.KEY_CODE]["TOTAL"]) +", 100%, 50%)";
        } else {
          return "hsl(0, 100%, 0%)";
        };
      })

    //地図移動時に境界データも一緒に移動させる処理
    map.on('move', function(d){
      d3.selectAll("path").each(update);
    });
  });
})
