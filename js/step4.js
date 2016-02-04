//object oriented d3
var graph = {
  //establish constant values
  components:{
    atts:{
      margin:50,
      barGap:5
    },
    scales:{}
  },
  getDimensions:function(){
    var components = this.components;
    var atts = components.atts;
    //set height and width based on container values
    atts.height = parseFloat(d3.select(".container").style("height"));
    atts.width = parseFloat(d3.select(".container").style("width"));
  },
  //make svg, g, and scales;
  makeGraphComponents: function(){
    this.getDimensions();
    var components = this.components;
    //append svg to container instead of body
    components.svg = d3.select(".container").append("svg");
    components.bars = components.svg.append("g");
    //make scales
    components.scales.xScale = d3.scale.linear();
    components.scales.yScale = d3.scale.linear();
    components.scales.colorScale = d3.scale.linear();
    this.setDimensions();
  },
  //move parts from makeGraphComponents down here so it can be utilized in resize function
  setDimensions: function(){
    var components = this.components;
    var atts = components.atts;
    var scales = components.scales;
    //set svg dimensions and scale ranges
    components.svg.attr("height",atts.height).attr("width",atts.width);
    components.scales.xScale.range([atts.margin,(atts.width-atts.margin)]);
    components.scales.yScale.range([atts.height-(2*atts.margin),atts.margin]);
    components.scales.colorScale.range(['teal','darkgreen']);
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
  //function invoked when window resizes
  resize:function(){
    this.getDimensions();
    this.setDimensions();
    var atts = this.components.atts;
    var scales = this.components.scales;
    //recalculate bar width
    var barCt = this.components.bars.selectAll("rect")[0].length;
    var barW = ((atts.width-(2*atts.margin))/barCt)-atts.barGap;
    //update bar widths
    d3.selectAll("rect")
      .attr("width",barW)
      .attr("transform", function(d,i){
        var x = scales.xScale(i)
        var y = atts.height-atts.margin-scales.yScale(d)
        return "translate("+x+","+y+")"
      })
  },
  //invoke all the above functions
  init: function(){
    var self = this;
    this.makeGraphComponents();
    this.updateChart(this.makeDataset());
    //update with a new dataset every two seconds
    setInterval(function(){
      this.updateChart(this.makeDataset());
    }.bind(this),2000)
    //bind resize event listener to window to call resize function
    window.addEventListener('resize', function(){
      this.resize();
    }.bind(this));
  }
}
graph.init();
