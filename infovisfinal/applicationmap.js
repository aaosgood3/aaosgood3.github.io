
var width = 960,
    height = 500;

var projection = d3.geo.mercator()
    .center([0, 5 ])
    .rotate([-180,0]);

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>University:</strong> <span style='color:#8c3752'>" + d.University + "</span>";
	});

svg.call(tip);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

d3.json("world-110m2.json", function(error, topology) {
	d3.csv("data.csv", function(data) {
		minDate = data[0].Time;
		maxDate = data[data.length-1].Time;

		g.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", function(d) {
				return projection([d.Lng, d.Lat])[0];
			})
			.attr("cy", function(d) {
				return projection([d.Lng, d.Lat])[1];
			})
			.attr("r", 3)
			.style("fill", "#8c3752")
			.on('mouseover', tip.show)
      		.on('mouseout', tip.hide);
	});

    g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
    .enter()
      .append("path")
      .attr("d", path)
});

var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("circle")
            .attr("d", path.projection(projection));
        g.selectAll("path")  
            .attr("d", path.projection(projection)); 
  });

svg.call(zoom);

