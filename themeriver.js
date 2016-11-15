var dataUri = "data.csv";
var colors = [new RGBColour(108,209,230), new RGBColour(224,227,204),new RGBColour(250,104,0)];
var years = [];

buildChart(dataUri);

function buildChart(uri) {
	var margin = {top: 30, right: 30, bottom: 30, left: 30};
	var width = document.body.clientWidth - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom;

	var strokeColor = randomColorMix(colors[0], colors[1], colors[2]);
	console.log(strokeColor.getRGB());

	var format = d3.time.format("%Y");

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height-10, 0]);
	var z = d3.scale.ordinal().range(colorrange);

	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.years);
	var yAxis = d3.svg.axis().scale(y);

	var stack = d3.layout.stack()
    .offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; });

    var nest = d3.nest()
    .key(function(d) { return d.key; });
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

	return new RGBColour(r * 255, g * 255, b * 255);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


$(window).resize(function(){
	document.getElementById("graph").innerHTML = "";
	buildChart("./data.csv");
});