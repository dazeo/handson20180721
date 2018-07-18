myData = [35, 38, 16];

d3.select("#myGraph")
  .selectAll(".dummy")
  .data(myData)
  .enter()
  .append("rect")
  .attr("width", 40)
  .attr("height", 0)
  .attr("x", function(d, i){
    return i * 80 + 50;
  })
  .attr("y", 300)
  .attr("fill", "blue")
  .attr("stroke", "black")
  .transition()
  .duration(2000)
  .attr("height", function(d, i){
    return d;
  })
  .attr("y", function(d,i){
    return 300 - d;
  })


d3.select("#myGraph")
  .append("rect")
  .attr("x", 50)
  .attr("y", 300)
  .attr("height", 1)
  .attr("width", 300)
