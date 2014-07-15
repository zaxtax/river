function linreg(data) {
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = 480 - margin.left - margin.right,
	height = 250 - margin.top - margin.bottom;

    var sx = d3.scale.linear()
	    .range([0, width]);

    var sy = d3.scale.linear()
	    .range([height, 0]);

    var xAxis = d3.svg.axis()
	    .scale(sx)
	    .orient("bottom");

    var yAxis = d3.svg.axis()
	    .scale(sy)
	    .orient("left");

    var line = d3.svg.line()
	    .x(function(d) { return sx(d.x); })
	    .y(function(d) { return sy(d.y); });

    if (d3.selectAll("#linreg").selectAll("svg").empty()) {
	// d3.selectAll("#linreg").selectAll("svg").remove();
	var svg = d3.select("#linreg").append("svg")
	 .attr("width", width + margin.left + margin.right)
	 .attr("height", height + margin.top + margin.bottom)
	 .append("g")
	 .attr("transform", "translate(" +
	       margin.left + "," + margin.top + ")");
    
	sx.domain(d3.extent(data, function(d) { return d.x; }));
	sy.domain(d3.extent(data, function(d) { return d.y; }));

	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis)
            .append("text")
            .text("x")
            .attr("x", width)
            .attr("y", -6)
            .attr("text-anchor", "end");

	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append("text")
            .text("y")
	    .attr("transform", "rotate(0)")
	    .attr("y", 6)
            .attr("dx", 10)
	    .attr("dy", ".71em")
	    .style("text-anchor", "end");

	svg.selectAll("path.line")
	    .data([data])
	    .enter()
	    .append("svg:path")
	    .attr("class", "line")
	    .attr("d", line);
 
    } else {
	sx.domain(d3.extent(data, function(d) { return d.x; }));
	sy.domain(d3.extent(data, function(d) { return d.y; }));
	svg = d3.selectAll("#linreg");

	svg.select("x axis").call(xAxis);
	svg.select("y axis").call(yAxis);

	svg.selectAll("path.line")
	    .data([data])
	    .transition()
            .attr("d", line);
    }

}
