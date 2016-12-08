createMap();

Lock = false;
function createMap() {
	var minDate;
	var maxDate;

	var width = 960,
	height = 500;

	var projection = d3.geo.albersUsa()
	.scale(750)
	.translate([width / 2, height / 2]);

	var path = d3.geo.path()
	.projection(projection);

	var svg = d3.select("#graph").append("svg")
	.attr("width", width)
	.attr("height", height);

	// var slider = d3.select("#graph").append("div")
	// .attr("id", "slider");

	// var sliderBootstrap = d3.select("#graph").append("input")
	// .attr("id", "campaigns")
	// .attr("type", "text");

	var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>University:</strong> <span style='color:#8c3752'>" + d.University + "</span><br/>"
		+ "<strong>Applied:</strong> <span style='color:#8c3752'>" + d.Time + "</span>";
	});

	svg.call(tip);

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

		var displaySites = function(data) {
			var sites = svg.selectAll(".site")
			.data(data)

			sites.enter()
			.append("circle")
			.attr("class", "site")
			.attr("cx", function(d) {
				console.log(d);
				return projection([d.Lng, d.Lat])[0];
			})
			.attr("cy", function(d) {
				return projection([d.Lng, d.Lat])[1];
			})
			.attr("r", 1)
			.transition().duration(400)
			.attr("r", 8);

			sites.exit()
			.transition().duration(200)
			.attr("r",1)
			.remove();

			d3.selectAll(".site")
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);
		};

		d3.csv("data.csv", function(data) {
			displaySuites(data);
			
			minDate = moment(data[0].Time, "MM/DD/YYYY HH:mm:ss");
			maxDate = moment(data[data.length-1].Time, "MM/DD/YYYY HH:mm:ss");

			var secondsInDay = 60 * 60 * 24;

			d3.select('#slider').call(d3.slider()
				.scale(d3.time.scale().domain([minDate.toDate(), maxDate.toDate()])).axis(d3.svg.axis())
				.on("slide", function(evt, value) {
					var newData = data.filter( function(d) {
						var time = moment(d.Time, "MM/DD/YYYY HH:mm:ss").unix() * 1000; // convert to ms
						return time < value;
					})
					displaySites(newData);
				}));
		});
});

function createCampaignSlider() {
	console.log("creating campaign slider");
	d3.csv("campaigns.csv", function(data) {
		var ticks = data.map(function(d) {
			return moment(d.Date, "MM/DD/YY").unix();
		});

		var tickLabels = data.map(function(d) {
			return d.Subject;
		});

			//ticks_labels: tickLabels
			console.log(tickLabels);
			$("#campaigns").slider({
				min: 0,
				max: 10,
				step: 5
			});
			console.log("creating campaign slider");
		})
}
}

// Resize with window size change
$(window).resize(function(){
	document.getElementById("graph").innerHTML = "";
	if (!Lock) {
		Lock = true;
		createMap();
		Lock = false;
	}
});
