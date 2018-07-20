d3.json("data1.json").then(function(myData){
  d3.json("citycode_tokyo.json").then(function(cityCode){

    //変数定義
    var svg = d3.select("#myGraph");
    var maxVal = 0;
    var minVal = 0;
    var yscale = 0;
    var cityCodeSelected = "13101";
    var dataset = [];
    const AXISX_NAME = ["凶悪犯", "粗暴犯", "侵入窃盗", "非侵入窃盗", "その他"];
    const BAR_WIDTH = 40;
    const BAR_MARGIN = 40;
    const OFFSET_X = 50;
    const OFFSET_Y = 300;
    const MARGIN_Y = 100;

    //セレクトボックスに市区町村名を挿入
    d3.select("#cityselect")
      .selectAll("dummy")
      .data(cityCode)
      .enter()
      .append("option")
      .text(function(d, i){
        return(d.name)
      })
      .attr("value", function(d, i){
        return(d.code)
      });

    //セレクトボックスが変更されたら発火
    d3.select("#cityselect")
      .on("change", function(){
        cityCodeSelected = $("#cityselect").val()
        console.log(cityCodeSelected)
        makeDataset()
        calcScale()
        updateGraph()
        updateAxis()
      });

    //スケールの計算
    function calcScale(){
      maxVal = Math.max.apply(null, dataset)
      minVal = Math.min.apply(null, dataset)
      yscale = d3.scaleLinear()
        .domain([0, maxVal])
        .range([(OFFSET_Y - MARGIN_Y), 0])

      xscale = d3.scaleBand()
        .domain(AXISX_NAME)
        .range([0, ((BAR_WIDTH + BAR_MARGIN) * AXISX_NAME.length)]);
    }

    //選択した市区町村のデータセットの作成
    function makeDataset(){
      dataset = []
      for(var key in myData[cityCodeSelected]){
        if(key != "CITY_NAME" && key != "TOTAL"){
          dataset.push(myData[cityCodeSelected][key])
        }
      }
    }

    //初期グラフ描画
    function drawGraph(){
      svg.selectAll(".dummy")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", BAR_WIDTH)
        .attr("height", 0)
        .attr("x", function(d, i){
          return i * (BAR_WIDTH + BAR_MARGIN) + OFFSET_X * 1.5;
        })
        .attr("y", OFFSET_Y)
        .transition()
        .duration(2000)
        .attr("height", function(d, i){
          return (OFFSET_Y - MARGIN_Y) - yscale(d);
        })
        .attr("y", function(d,i){
          return MARGIN_Y + yscale(d);
        })
    }

    //グラフの更新
    function updateGraph(){
      console.log("update!", dataset)
      svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(1000)
        .attr("height", function(d, i){
          return (OFFSET_Y - MARGIN_Y) - yscale(d);
        })
        .attr("y", function(d,i){
          return MARGIN_Y + yscale(d);
        })
      console.log(svg.selectAll(".bar"))
    }

    //初期軸の作成
    function drawAxis(){
      svg.append("g")
        .attr("class", "axisY")
        .call(d3.axisLeft(yscale))
        .attr("transform", "translate("+OFFSET_X+", "+MARGIN_Y+")");

      svg.append("g")
        .attr("class", "axisX")
        .call(d3.axisBottom(xscale))
        .attr("transform", "translate("+OFFSET_X+", "+OFFSET_Y+")");
    }

    //軸の更新
    function updateAxis(){
      svg.select(".axisY")
        .remove()
      svg.append("g")
        .attr("class", "axisY")
        .call(d3.axisLeft(yscale))
        .attr("transform", "translate("+OFFSET_X+", "+MARGIN_Y+")");
    }

    //初期描画のための関数実行
    makeDataset()
    calcScale()
    drawGraph()
    drawAxis()
  })
})
