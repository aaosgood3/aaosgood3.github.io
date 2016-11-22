var width = 960,
    height = 500;

var projection = d3.geo.mercator()
    .center([0, 5 ])
    .rotate([-180,0]);

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

d3.json("world-110m2.json", function(error, topology) {
	d3.csv("data.csv", function(data) {
		g.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", function(d) {
				return projection([d.Lng, d.Lat][0]);
			})
			.attr("cy", function(d) {
				return projection([d.Lng, d.Lat][1]);
			})
			.attr("r", 3)
			.style("fill", "black");
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