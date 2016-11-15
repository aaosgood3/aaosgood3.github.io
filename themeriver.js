var dataUri = "data.csv";
var colors = [new RGBColour(108,209,230), new RGBColour(224,227,204),new RGBColour(250,104,0)];
var years = [];

buildChart(dataUri);

function buildChart(uri) {
	var margin = {top: 30, right: 30, bottom: 30, left: 30};
	var width = document.body.clientWidth - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom;

	var strokeColor = randomColorMix(colors[0].getRGB(), colors[1].getRGB(), colors[2].getRGB(), 1);
	console.log(strokeColor.getRGB());

	var format = d3.time.format("%Y");

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height-10, 0]);
	
	//var colors = d3.scale.ordinal().range(colorrange);

	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.years);
	var yAxisLeft = d3.svg.axis().scale(y);
	var yAxisRight = d3.svg.axis().scale(y);

	var stack = d3.layout.stack()
	.offset("silhouette")
	.values(function(d) { 
		console.log(d);
		return d.values; })
	.x(function(d) { return d.date; })
	.y(function(d) { return d.value; });

	var nest = d3.nest()
	.key(function(d) { return d.key; });

	var area = d3.svg.area()
	.interpolate("cardinal")
	.x(function(d) { return x(d.date); })
	.y0(function(d) { return y(d.y0); })
	.y1(function(d) { return y(d.y0 + d.y); });

	var svg = d3.select(".graph").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var graph = d3.csv(uri, function(data) {
		console.log(data);
		data.forEach(function(d) {
			console.log(d);
		});

		var layers = stack(nest.entries(data));

		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);
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