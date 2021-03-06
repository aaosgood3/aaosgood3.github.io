var dataUri = "data.csv";
var dataGlobal;

var colors = d3.scale.category20();
var years = [];

var invertedLayers = false;

var usingDefaultData = true;
var lastUploadedCSV = "";

getCSVData(dataUri);

function getCSVData(uri) {
	d3.csv(uri, function(data) {
		dataGlobal = data;
		buildChart();
	});
}

function parseCSVData(string) {
	lastUploadedCSV = string;
	usingDefaultData = false;

	var data = d3.csv.parse(string);
	dataGlobal = data;
	buildChart();
}

function buildChart() {
	createToolTip();
	var data = dataGlobal;

	var strokeColor = "#fff";

	var margin = {top: 20, right: 40, bottom: 30, left: 30};
	var width = document.body.clientWidth - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height - 10, 0]);
	
	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10).tickFormat(d3.format("d"));
	var yAxisLeft = d3.svg.axis().scale(y).orient("left");
	var yAxisRight = d3.svg.axis().scale(y).orient("right");

	var svg = d3.select("div#graph").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var headers = d3.keys(data[0]);

	// Remove League
	headers.splice(headers.indexOf('League'), 1);
	years = headers;

	if (invertedLayers) {
		data.reverse();
	}

	var layers = d3.layout.stack()
	.offset("silhouette")
	(data.map(function(d) {
		return headers.map(function(c) {
			return {x: c, y: +d[c], key: d.League};
		});
	}));

	x.domain(d3.extent(layers[0], function(d) { return d.x; }));
	y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]);

	var area = d3.svg.area()
	.interpolate("cardinal")
	.x(function(d) { return x(d.x); })
	.y0(function(d) { return y(d.y0); })
	.y1(function(d) { return y(d.y0 + d.y); });

	var layer = svg.selectAll(".layer")
	.data(layers)
	.enter().append("path")
	.attr("class", "layer")
	.attr("d", function(d) { return area(d); })
	.style("fill", function(d, i) { return colors(i); });

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

	svg.selectAll(".layer")
	.on("mouseover", toolTipMouseOver)
	.on("mouseout", toolTipMouseOut)
	.on("mousemove", addToolTip);

	function toolTipMouseOver(d, i) {
		d3.selectAll(".layer").style("opacity", 0.2);

		d3.select("#tooltip").style("display", "inline");

		d3.select(this)
		.style("opacity", "1")
		.style("stroke", strokeColor)
		.style("stroke-width", "5px")
		.style("fill", "#F3F315");
	}

	function toolTipMouseOut(d, i) {
		d3.selectAll(".layer").style("opacity", 1);

		d3.select(this)
		.style("stroke-width", "0px")
		.style("fill", colors(i));

		removeToolTip();
	}

	function addToolTip(d) {
		var mouseDate = x.invert(d3.event.pageX);
		var bisectDate = d3.bisector(function(d) { return d.x; }).left;
		var i = bisectDate(d, mouseDate);
		var datum = d[i - 1];

		d3.select("#tooltip")
		.style("top", d3.event.pageY - 10)
		.style("left", d3.event.pageX + 10)
		.html("(" + datum.key + ", " + datum.x + ", " + datum.y + ")");
	}

	function removeToolTip() {
		d3.select("#tooltip").style("display", "none");
	}
}

function createToolTip() {
	var tooltip = d3.select("div#graph").append("div")
	.attr("id", "tooltip")
	.style("position", "absolute")
	.style("top","0px")
	.style("left", "0px")
	.style("z-index", "100")
	.style("display","none");
}

function fileSelected() {
	var file = document.getElementById('fileToUpload').files[0];
	if (file) {
		var fileSize = 0;
		if (file.size > 1024 * 1024) {
			fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		} else {
			fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
		}

		document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
		document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
		document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
		document.getElementById('submit').style.display = "block";
	}
}

function uploadFile() {
	var file = document.getElementById('fileToUpload').files[0];

	var reader = new FileReader();
	reader.onload = function() {
		var dataString = reader.result;
		document.getElementById("graph").innerHTML = "";
		document.getElementById('title').innerHTML = document.getElementById('fileName').innerHTML;
		parseCSVData(dataString);
	}
	reader.readAsText(file);
}

function invertData() {
	invertedLayers = !invertedLayers;
	document.getElementById("graph").innerHTML = "";
	if (usingDefaultData) {
		getCSVData(dataUri);
	} else {
		parseCSVData(lastUploadedCSV);
	}
}

$(window).resize(function(){
	document.getElementById("graph").innerHTML = "";
	if (usingDefaultData) {
		getCSVData(dataUri);
	} else {
		parseCSVData(lastUploadedCSV);
	}
});