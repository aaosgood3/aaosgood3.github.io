var dataUri = "data.csv";
var colors = [new RGBColour(108,209,230), new RGBColour(224,227,204),new RGBColour(250,104,0)];
var graphColors = [];
var years = [];

buildChart(dataUri);

function buildChart(uri) {
	var margin = {top: 20, right: 40, bottom: 30, left: 30};
	var width = document.body.clientWidth - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom;

	var strokeColor = randomColorMix(colors[0].getRGB(), colors[1].getRGB(), colors[2].getRGB(), 1);

	var format = d3.time.format("%Y");

	var x = d3.scale.ordinal().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);
	
	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.years);
	var yAxisLeft = d3.svg.axis().scale(y).orient("left");
	var yAxisRight = d3.svg.axis().scale(y).orient("right");

	var svg = d3.select("div#graph").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv(uri, function(data) {
		console.log(data);
		var headers = d3.keys(data[0]);

		// Remove League
		headers.splice(headers.indexOf('League'), 1);

		var layers = d3.layout.stack().offset("silhouette")(data.map(function(d) {
			return headers.map(function(c) {
				console.log({x: c, y: +d[c]});
				d.key = d.League;
				return {x: c, y: +d[c]};
			});
		}));

		x.domain(d3.extent(layers[0], function(d) { return d.x; }));
		y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]);

		while (graphColors.length < headers.length) {
			graphColors.push(randomColorMix(colors[0].getRGB(), colors[1].getRGB(), colors[2].getRGB(), 1));
		}

		var area = d3.svg.area()
		.interpolate("cardinal")
		.x(function(d) { return x(d.x); })
		.y0(function(d) { return y(d.y0); })
		.y1(function(d) { return y(d.y0 + d.y); });

		// var layer = svg.selectAll(".layer")
		// .data(layers)
		// .enter().append("path")
		// .attr("class", "layer")
		// .attr("d", function(d) { return area(d.values); })
		// .style("fill", function(d, i) { return graphColors(i); });

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + width + ", 0)")
		.call(yAxisRight);

		svg.append("g")
		.attr("class", "y axis")
		.call(yAxisLeft);
	});
}

function randomColorMix(color1, color2, color3, greyControl) {
	var randomIndex = getRandomInt(0, 2);

	var mixRatio1 = (randomIndex == 0) ? Math.random() * greyControl : Math.random();
	var mixRatio2 = (randomIndex == 1) ? Math.random() * greyControl : Math.random();
	var mixRatio3 = (randomIndex == 2) ? Math.random() * greyControl : Math.random();

	var sum = mixRatio1 + mixRatio2 + mixRatio3;

	mixRatio1 /= sum;
	mixRatio2 /= sum;
	mixRatio3 /= sum;

	var r = mixRatio1 * color1.r + mixRatio2 * color2.r + mixRatio3 * color3.r;
	var g = mixRatio1 * color1.g + mixRatio2 * color2.g + mixRatio3 * color3.g;
	var b = mixRatio1 * color1.b + mixRatio2 * color2.b + mixRatio3 * color3.b;

	return new RGBColour(r, g, b);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


$(window).resize(function(){
	document.getElementById("graph").innerHTML = "";
	buildChart("./data.csv");
});