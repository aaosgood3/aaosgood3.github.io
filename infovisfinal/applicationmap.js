var width = 960,
    height = 500;

var projection = d3.geo.mercator()
    .center([0, 5])
    .rotate([-180, 0]);

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

var slider = d3.select("#graph").append("div")
	.attr("width", width)
	.style("margin", "20px 0 10px 20px");

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

d3.json("world-110m2.json", function(error, topology) {
	d3.csv("data.csv")
		.row(function(d) {
			return {
				university: d.University,
				lat: parseFloat(d.Lat),
				lng: parseFloat(d.Lng),
				time: moment(d.Time, "YYYY-MM-DD HH:mm:ss").unix()
			};
		})
		.get(function(err, rows) {
    		if (err) return console.error(err);
    		window.site_data = rows;
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

var displaySites = function(data) {
  var sites = svg.selectAll(".site")
      .data(data, function(d) {
        return d.university;
      });

  sites.enter().append("circle")
      .attr("class", "site")
      .attr("cx", function(d) {
        return projection([d.lng, d.lat])[0];
      })
      .attr("cy", function(d) {
        return projection([d.lng, d.lat])[1];
      })
      .attr("r", 1)
      .transition().duration(400)
  	  	.attr("r", 5)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  sites.exit()
    .transition().duration(200)
      .attr("r",1)
      .remove();
};

var minDateUnix = moment(data[0].Time, "YYYY MM DD").unix();
var maxDateUnix = moment(data[data.length-1].Time, "YYYY MM DD").unix();
var secondsInDay = 60 * 60 * 24;

var updateData = d3.slider()
  .axis(true).min(minDateUnix).max(maxDateUnix).step(secondsInDay)
  .on("slide", function(evt, value) {
    var newData = _(site_data).filter( function(site) {
      return site.time < value;
    })
    displaySites(newData);
  });

d3.select('#slider').call(updateData);

// Resize with window size change
$(window).resize(function(){
	document.getElementById("graph").innerHTML = "";
	if (usingDefaultData) {
		getCSVData(dataUri);
	} else {
		parseCSVData(lastUploadedCSV);
	}
});
