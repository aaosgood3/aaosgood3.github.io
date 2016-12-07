createMap();

function createMap() {
	var width = 960,
	height = 500;

	var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

	var svg = d3.select("#graph").append("svg")
	.attr("width", width)
	.attr("height", height);

	var slider = d3.select("#graph").append("div")
	.attr("id", "slider")
	.attr("width", width)

	var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>University:</strong> <span style='color:#8c3752'>" + d.University + "</span><br/>"
		+ "<strong>Applied:</strong> <span style='color:#8c3752'>" + d.Time + "</span>";
	});

	svg.call(tip);

	var path = d3.geo.path()
	.projection(projection);

	var g = svg.append("g");

	d3.json("us.json", function(error, us) {
		svg.append("path")
      	.datum(topojson.feature(us, us.objects.land))
      	.attr("d", path)
      	.attr("class", "land-boundary");

      	svg.append("path")
      	.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      	.attr("d", path)
      	.attr("class", "state-boundary");

		d3.csv("data.csv", function(data) {
			var displaySites = function(data) {
				var sites = svg.selectAll(".site")
				.data(data)

				sites.enter()
				.append("circle")
				.attr("class", "site")
				.attr("cx", function(d) {
					return projection([d.Lng, d.Lat])[0];
				})
				.attr("cy", function(d) {
					return projection([d.Lng, d.Lat])[1];
				})
				.attr("r", 1)
				.transition().duration(400)
				.attr("r", 5);

				sites.exit()
				.transition().duration(200)
				.attr("r",1)
				.remove();

				d3.selectAll(".site")
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide);
			};

			var minDate = moment(data[0].Time, "MM/DD/YYYY HH:mm:ss");
			var maxDate = moment(data[data.length-1].Time, "MM/DD/YYYY HH:mm:ss");
			var secondsInDay = 60 * 60 * 24;

			var updateData = d3.slider()
			.scale(d3.time.scale().domain([minDate.toDate(), maxDate.toDate()])).axis(d3.svg.axis())
			.on("slide", function(evt, value) {
				var newData = data.filter( function(d) {
					var time = moment(d.Time, "MM/DD/YYYY HH:mm:ss").unix() * 1000; // convert to ms
					return time < value;
				});
				displaySites(newData);
			});

		d3.select('#slider').call(updateData);
	});


	// g.selectAll("path")
	// .data(topojson.object(topology, topology.objects.countries)
	// 	.geometries)
	// .enter()
	// .append("path")
	// .attr("d", path)
	// });

	var zoom = d3.behavior.zoom()
	.on("zoom",function() {
		svg.attr("transform","translate("+ 
			d3.event.translate.join(",")+")scale("+d3.event.scale+")");
		svg.selectAll("circle")
		.attr("d", path.projection(projection));
		svg.selectAll("path")  
		.attr("d", path.projection(projection)); 
	});

	svg.call(zoom);
}

// Resize with window size change
$(window).resize(function(){
	document.getElementById("graph").innerHTML = "";
	createMap();
});
