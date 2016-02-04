var graph = {
  components:{
    atts:{
      height:500,
      width:500,
      margin:50,
      barGap:5
    }
  },
  makeGraphComponents: function(){
    var components = this.components;
    var atts = components.atts;
    components.svg = d3.select("body").append("svg").attr("height",atts.height).attr("width",atts.width);
    components.bars = components.svg.append("g");
    components.xScale = d3.scale.linear().range([atts.margin,(atts.width-atts.margin)]);
    components.yScale = d3.scale.linear().range([atts.height-(2*atts.margin),atts.margin]);
    components.colorScale = d3.scale.linear().range(['teal','darkgreen']);
  },
  makeDataset:function(){
    var dataset = [];
    var dataLength = Math.floor(Math.random()*6) + 4;
    for (var i = 0; i < dataLength; i++) {
      var newNumber = Math.round(Math.random() * 30);
      dataset.push(newNumber);
    }
    return dataset;
  },
  updateScales: function(dataset){
    this.components.xScale.domain([0,dataset.length]);
    this.components.yScale.domain(d3.extent(dataset));
    this.components.colorScale.domain([0,dataset.length])
  },
  updateChart: function(dataset){
    var g = this.components.bars;
    this.updateScales(dataset);
    var xScale = this.components.xScale;
    var yScale = this.components.yScale;
    var colorScale = this.components.colorScale;
    var atts = this.components.atts;
    var barW = ((atts.width-(2*atts.margin))/dataset.length)-atts.barGap;
    var selection = g.selectAll("rect").data(dataset)
    selection.transition().duration(500)
      .style("fill", function(d,i){
        return colorScale(i);
      })
      .attr("height", function(d){
        return yScale(d);
      })
      .attr("width", barW)
      .attr("transform", function(d,i){
        return "translate("+xScale(i)+","+(atts.height-atts.margin-yScale(d))+")"
      })
    selection.enter().append("rect")
      .style("fill", function(d,i){
        return colorScale(i);
      })
      .attr("height", function(d){
        return yScale(d);
      })
      .attr("width",barW)
      .attr("transform", function(d,i){
        return "translate("+xScale(i)+","+(atts.height-atts.margin-yScale(d))+")"
      })
    selection.exit().remove();
  },
  init: function(){
    this.makeGraphComponents();
    this.updateChart(this.makeDataset());
    setInterval(function(){
      this.updateChart(this.makeDataset());
    }.bind(this),2000)
  }
}
graph.init();
