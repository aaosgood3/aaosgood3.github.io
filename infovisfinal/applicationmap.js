createMap();

function createMap() {

	var projection = d3.geo.mercator()
	.center([0, 2])
	.rotate([-180, 0]);

	var zoom = d3.behavior.zoom()
	.scaleExtent([1, 10])
	.on("zoom", zoomed);

	var svg = d3.select("#graph")
	.append("div")
	.classed("svg-container", true)
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 960 600")
    .classed("svg-content-responsive", true)
    .call(zoom);

	var slider = d3.select("#graph").append("div")
	.attr("id", "slider")
	.attr("width", svg.node().getBBox().width)

	var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>University:</strong> <span style='color:#8c3752'>" + d.University + "</span><br/>"
		+ "<strong>Applied:</strong> <span style='color:#8c3752'>" + d.Time + "</span>";
	});

	svg.call(tip);

	var path = d3.geo.path().projection(projection);

	var g = svg.append("g");

	function addCircles() {
		d3.json("world-110m2.json", function(error, topology) {
			d3.csv("data.csv", function(data) {
				var displaySites = function(data) {
					var sites = svg.selectAll(".site")
					.data(data, function(d) {
						return d.University;
					});

					sites.enter().append("circle")
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

					d3.selectAll("circle")
					.on('mouseover', tip.show)
					.on('mouseout', tip.hide);

					sites.exit()
					.transition().duration(200)
					.attr("r",1)
					.remove();
				};

				var minDate = moment(data[0].Time, "MM/DD/YYYY HH:mm:ss");
				var maxDate = moment(data[data.length-1].Time, "MM/DD/YYYY HH:mm:ss");
				var secondsInDay = 60 * 60 * 24;

				var updateData = d3.slider()
				.scale(d3.time.scale().domain([minDate.toDate(), maxDate.toDate()])).axis(d3.svg.axis())
				// .axis(true).min(minDateUnix).max(maxDateUnix).step(secondsInDay)
				.on("slide", function(evt, value) {
					var newData = data.filter( function(d) {
						var time = moment(d.Time, "MM/DD/YYYY HH:mm:ss").unix() * 1000; // convert to ms
						return time < value;
					});
					displaySites(newData);
				});

				d3.select('#slider').call(updateData);
			});

			g.selectAll("path")
			.data(topojson.object(topology, topology.objects.countries)
				.geometries)
			.enter()
			.append("path")
			.attr("d", path)
			});
	}

	function zoomed() {
	  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

	  d3.selectAll("circle").remove();
	  addCircles();
	}

}

// // Resize with window size change
// $(window).resize(function(){
// 	document.getElementById("graph").innerHTML = "";
// 	createMap();
// });
