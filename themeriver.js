(function() {

	$(window).resize(function(){
		document.getElementById("graph").innerHTML = "";
		buildChart("./data.csv");
	});

	var dataUri = "data.csv";
	var colors = [new RGBColour(108,209,230), new RGBColour(224,227,204),new RGBColour(250,104,0)];
	var years = [];

	buildChart(dataUri);

	function buildChart(uri) {
		var format = d3.time.format("%Y");
		var margin = {top: 30, right: 30, bottom: 30, left: 30};
		var strokeColor = randomColorMix(colors[0], colors[1], colors[2]);
		console.log(strokeColor.getRGB());



	}

	function randomColorMix(color1, color2, color2, greyControl) {
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

}) ()