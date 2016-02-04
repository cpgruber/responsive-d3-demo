//object oriented d3
var graph = {
  //establish constant values
  components:{
    atts:{
      height:400,
      width:500,
      margin:20,
      barGap:5
    },
    scales:{}
  },
  //make svg, g, and scales;
  makeGraphComponents: function(){
    var components = this.components;
    var atts = components.atts;
    components.svg = d3.select("body").append("svg").attr("height",atts.height).attr("width",atts.width);
    components.bars = components.svg.append("g");
    components.scales.xScale = d3.scale.linear().range([atts.margin,(atts.width-atts.margin)]);
    components.scales.yScale = d3.scale.linear().range([atts.height-(2*atts.margin),atts.margin]);
    components.scales.colorScale = d3.scale.linear().range(['teal','darkgreen']);
  },
  //make a random dataset, length 5 to 10, range 0 to 30
  makeDataset:function(){
    var dataset = [];
    var dataLength = Math.floor(Math.random()*6) + 5;
    for (var i = 0; i < dataLength; i++) {
      var newNumber = Math.round(Math.random() * 30);
      dataset.push(newNumber);
    }
    return dataset;
  },
  //update scale domains for current dataset
  updateScales: function(dataset){
    var scales = this.components.scales;
    scales.xScale.domain([0,dataset.length]);
    scales.yScale.domain(d3.extent(dataset));
    scales.colorScale.domain([0,dataset.length])
  },
  //update chart for current dataset
  updateChart: function(dataset){
    var g = this.components.bars;
    this.updateScales(dataset);
    var scales = this.components.scales;
    var atts = this.components.atts;
    var barW = ((atts.width-(2*atts.margin))/dataset.length)-atts.barGap;
    var selection = g.selectAll("rect").data(dataset)
    //transition existing bars
    selection.transition().duration(500)
      .style("fill", function(d,i){
        return scales.colorScale(i);
      })
      .attr("height", function(d){
        return scales.yScale(d);
      })
      .attr("width", barW)
      .attr("transform", function(d,i){
        var x = scales.xScale(i)
        var y = atts.height-atts.margin-scales.yScale(d)
        return "translate("+x+","+y+")"
      })
    //add any new bars
    selection.enter().append("rect")
      .style("fill", function(d,i){
        return scales.colorScale(i);
      })
      .attr("height", function(d){
        return scales.yScale(d);
      })
      .attr("width", barW)
      .attr("transform", function(d,i){
        var x = scales.xScale(i)
        var y = atts.height-atts.margin-scales.yScale(d)
        return "translate("+x+","+y+")"
      })
    //remove any extra bars
    selection.exit().remove();
  },
  //invoke all the above functions
  init: function(){
    this.makeGraphComponents();
    this.updateChart(this.makeDataset());
    //update with a new dataset every two seconds
    setInterval(function(){
      this.updateChart(this.makeDataset());
    }.bind(this),2000)
  }
}
graph.init();
