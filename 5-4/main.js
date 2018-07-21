$("#map").width("100%")
$("#map").height($(window).height() - 40)

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

    var contentsCode = "TOTAL";
    var hueScale = 0;
    var dataset = [];

    //セレクトボックスが変更されたら発火
    d3.select("#contentsselect")
      .on("change", function(){
        contentsCode = $("#contentsselect").val()
        d3.select("#map_minigraph").style("display", "none")
        makeDataset();
        calcScale();
        updateMap();
      });

    //データセット作成処理
    function makeDataset(){
      dataset = [];
      for(var key in myData){
        if(myData[key][contentsCode] != "NA"){
          dataset.push(myData[key][contentsCode]);
        }
      };
      for(var i = 0; i < geom.features.length; i++){
        var temp = geom.features[i].properties.KEY_CODE
        if(myData[temp][contentsCode] != "NA"){
          geom.features[i].properties.VALUE = myData[temp][contentsCode]
        }
      }
    }

    //値に応じた色付け手法定義
    function calcScale(){
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

    //初期境界データ描画
    function drawMap(){
      d3.select("svg").selectAll("path")
        .data(geom.features)
        .enter()
        .append("path")
        .attr("fill", function(d, i){
          return "hsl(0, 100%, 100%)";
        })
        .attr("opacity", 0.5)
        .attr("stroke", "white")
        .style("pointer-events", "auto")
        .each(update)
        .transition()
        .duration(1000)
        .attr("fill", function(d, i){
          if(myData[d.properties.KEY_CODE][contentsCode] != "NA"){
            return "hsl("+ hueScale(myData[d.properties.KEY_CODE][contentsCode]) +", 100%, 50%)";
          } else {
            return "hsl(0, 100%, 100%)";
          };
        })
    }

    //地図データ更新
    function updateMap(){
      d3.selectAll("path")
        .transition()
        .duration(1000)
        .attr("fill", function(d, i){
          if(myData[d.properties.KEY_CODE][contentsCode] != "NA"){
            return "hsl("+ hueScale(myData[d.properties.KEY_CODE][contentsCode]) +", 100%, 50%)";
          } else {
            return "hsl(0, 100%, 0%)";
          };
        })
    }


    function fukidashi(point, thisdata){
      console.log("click")
      $("#map_minigraph").textWithLF(function(){
        var temp = d3.format(",.0f")(thisdata.__data__.properties.VALUE)
        var output = "町字名： " + thisdata.__data__.properties.CITY_NAME + " " + thisdata.__data__.properties.S_NAME + "\n"
          + "値： " + temp
        return output;
      })
      .attr("style", function(){
        var f_width = $("#map_minigraph").outerWidth()
        var f_height = $("#map_minigraph").outerHeight()
        return ("left:" + (point.pageX - f_width * 0.5) + "px;" +
          "top:" + (point.pageY - f_height - 16) + "px; display: block;" +
           "border-radius: 1em;")
      })
      .on("click", function(){
        d3.select("#map_minigraph").style("display", "none")
      })
    }

    makeDataset();
    calcScale();
    drawMap();

    $("#map path").click(function(e) {
      fukidashi(e, this)
    })

    //地図移動時に境界データも一緒に移動させる処理
    map.on('move', function(d){
      d3.selectAll("path").each(update);
      d3.select("#map_minigraph").style("display", "none")
    });


    //text折り返しapi https://s8a.jp/jquery-text-with-lf
    (function(r){function l(a){return b(a,c,t,function(a){return u[a]})}function m(a){return b(a,f,v,function(a){return w[a]})}function b(a,b,d,e){return a&&d.test(a)?a.replace(b,e):a}function d(a){if(null==a)return"";if("string"==typeof a)return a;if(Array.isArray(a))return a.map(d)+"";var b=a+"";return"0"==b&&1/a==-(1/0)?"-0":b}var u={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},c=/[&<>"']/g,t=new RegExp(c.source),w={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},f=/&(?:amp|lt|gt|quot|#39);/g,
    v=new RegExp(f.source),e=/<(?:.|\n)*?>/mg,n=new RegExp(e.source),g=/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,p=new RegExp(g.source),h=/<br\s*\/?>/mg,q=new RegExp(h.source);r.fn.textWithLF=function(a){var c=typeof a;return"undefined"==c?m(b(b(this.html(),h,q,"\n"),e,n,"")):this.html("function"==c?function(c,f){var k=a.call(this,c,m(b(b(f,h,q,"\n"),e,n,"")));return"undefined"==typeof k?k:b(l(d(k)),g,p,"$1<br>")}:b(l(d(a)),g,p,"$1<br>"))}})(jQuery);

  });
})
