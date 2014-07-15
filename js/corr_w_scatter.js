function correlationPlot(data) {
    var cells,
	colorScale, colors,
	corXscale, corYscale, corZscale,
	corr, corrplot, drawScatter,
	h, i, innerPad, j,
	nGroup, nind, nvar, pad,
	scatterplot, svg,
	totalh, totalw, w;
    h = 300;
    w = h;
    pad = {
      left: 70,
      top: 40,
      right: 5,
      bottom: 70
    };
    innerPad = 5;
    totalh = h + pad.top + pad.bottom;
    totalw = (w + pad.left + pad.right) * 2;
    
    data_keys = Object.keys(data); 
    nind = data[data_keys[0]].length;
    nvar = data_keys.length;
    lastsamples = 100;
    corXscale = d3.scale.ordinal().domain(d3.range(nvar)).rangeBands([0, w]);
    corYscale = d3.scale.ordinal().domain(d3.range(nvar)).rangeBands([h, 0]);
    corZscale = d3.scale.linear()
	.domain([-1, 0, 1])
	.range(["darkslateblue", "white", "crimson"]);
    corr = [];
    for (i in data_keys) {
      for (j in data_keys) {
        corr.push({
          row: i,
          col: j,
          value: ss.sample_correlation(data[data_keys[i]],
				       data[data_keys[j]])
        });
      }
    }
  
    //d3.selectAll("div#corplot").selectAll("svg").remove();
    if (d3.selectAll("#corrplot").empty()) {
	svg = d3.select("div#corplot")
	    .append("svg")
	    .attr("height", totalh)
	    .attr("width", totalw);
	corrplot = svg.append("g")
	    .attr("id", "corrplot")
	    .attr("transform", "translate(" + pad.left + "," + pad.top + ")");
	scatterplot = svg.append("g")
	    .attr("id", "scatterplot")
	    .attr("transform", "translate(" 
		  + (pad.left*2 + pad.right + w)
		  + ","
		  + pad.top
		  + ")");

	corrplot.append("rect")
	    .attr("height", h)
	    .attr("width", w)
	    .attr("fill", "none")
	    .attr("stroke", "black")
	    .attr("stroke-width", 1)
	    .attr("pointer-events", "none");
	corrplot.append("text")
	    .text("Correlation matrix")
	    .attr("id", "corrtitle")
	    .attr("x", w / 2)
	    .attr("y", -pad.top / 2)
	    .attr("dominant-baseline", "middle")
	    .attr("text-anchor", "middle");
	scatterplot.append("text")
	    .text("Scatterplot")
	    .attr("id", "corrtitle")
	    .attr("x", w / 2)
	    .attr("y", -pad.top / 2)
	    .attr("dominant-baseline", "middle")
	    .attr("text-anchor", "middle");
	d3.select("div#legend")
	    .style("opacity", 1);

	scatterplot.append("rect")
	    .attr("height", h)
	    .attr("width", w)
	    .attr("fill", "whitesmoke")
	    .attr("stroke", "black")
	    .attr("stroke-width", 1)
	    .attr("pointer-events", "none");

	cells = corrplot.selectAll("empty")
	    .data(corr).enter()
	    .append("rect")
	    .attr("class", "cell")
	    .attr("x", function(d) {
		return corXscale(d.col);
	    }).attr("y", function(d) {
		return corYscale(d.row);
	    }).attr("width", corXscale.rangeBand())
	    .attr("height", corYscale.rangeBand())
	    .attr("fill", function(d) {
		return corZscale(d.value);
	    }).attr("stroke", "none")
	    .attr("stroke-width", 2)
	    .on("mouseover", function(d) {
		d3.select(this).attr("stroke", "black");
		corrplot.append("text")
		    .attr("id", "corrtext")
		    .text(d3.format(".2f")(d.value))
		    .attr("x", function() {
			var mult;
			mult = -1;
			if (d.col < nvar / 2) {
			    mult = +1;
			}
			return corXscale(d.col) + mult * 30;
		    }).attr("y", function() {
			var mult;
			mult = +1;
			if (d.row < nvar / 2) {
			    mult = -1;
			}
			return corYscale(d.row) + (mult + 0.35) * 20;
		    }).attr("fill", "black")
		    .attr("dominant-baseline", "middle")
		    .attr("text-anchor", "middle");
		corrplot.append("text")
		    .attr("class", "corrlabel")
		    .attr("x", corXscale(d.col))
		    .attr("y", h + pad.bottom * 0.2)
		    .text(data_keys[d.col])
		    .attr("dominant-baseline", "middle")
		    .attr("text-anchor", "middle");
		return corrplot.append("text")
		    .attr("class", "corrlabel")
		    .attr("y", corYscale(d.row))
		    .attr("x", -pad.left * 0.1)
		    .text(data_keys[d.row])
		    .attr("dominant-baseline", "middle")
		    .attr("text-anchor", "end");
	    }).on("mouseout", function() {
		d3.selectAll("text.corrlabel").remove();
		d3.selectAll("text#corrtext").remove();
		return d3.select(this).attr("stroke", "none");
	    }).on("click", function(d) {
		return drawScatter(d.col, d.row);
	    });
	
    } else {
    	corrplot = d3.select("#corrplot");
    	scatterplot = d3.select("#scatterplot");

	corrplot.selectAll("rect")
	    .data(corr)
	    .attr("class", "cell")
	    .attr("x", function(d) {
		return corXscale(d.col);
	    }).attr("y", function(d) {
		return corYscale(d.row);
	    }).attr("width", corXscale.rangeBand())
	    .attr("height", corYscale.rangeBand())
	    .attr("fill", function(d) {
		return corZscale(d.value);
	    }).attr("stroke", "none")
	    .attr("stroke-width", 2)
	    .on("mouseover", function(d) {
		d3.select(this).attr("stroke", "black");
		corrplot.append("text")
		    .attr("id", "corrtext")
		    .text(d3.format(".2f")(d.value))
		    .attr("x", function() {
			var mult;
			mult = -1;
			if (d.col < nvar / 2) {
			    mult = +1;
			}
			return corXscale(d.col) + mult * 30;
		    }).attr("y", function() {
			var mult;
			mult = +1;
			if (d.row < nvar / 2) {
			    mult = -1;
			}
			return corYscale(d.row) + (mult + 0.35) * 20;
		    }).attr("fill", "black")
		    .attr("dominant-baseline", "middle")
		    .attr("text-anchor", "middle");
		corrplot.append("text")
		    .attr("class", "corrlabel")
		    .attr("x", corXscale(d.col))
		    .attr("y", h + pad.bottom * 0.2)
		    .text(data_keys[d.col])
		    .attr("dominant-baseline", "middle")
		    .attr("text-anchor", "middle");
		return corrplot.append("text")
		    .attr("class", "corrlabel")
		    .attr("y", corYscale(d.row))
		    .attr("x", -pad.left * 0.1)
		    .text(data_keys[d.row])
		    .attr("dominant-baseline", "middle")
		    .attr("text-anchor", "end");
	    }).on("mouseout", function() {
		d3.selectAll("text.corrlabel").remove();
		d3.selectAll("text#corrtext").remove();
		return d3.select(this).attr("stroke", "none");
	    }).on("click", function(d) {
		return drawScatter(d.col, d.row, data_keys);
	    });
    }

    drawScatter = function(i, j, data_keys) {
	var xScale, xticks, yScale, yticks;
	d3.selectAll("circle.points").remove();
	d3.selectAll("text.axes").remove();
	d3.selectAll("line.axes").remove();
	xScale = d3.scale.linear()
	    .domain(d3.extent(data[data_keys[i]]))
	    .range([innerPad, w - innerPad]);
	yScale = d3.scale.linear()
	    .domain(d3.extent(data[data_keys[j]]))
	    .range([h - innerPad, innerPad]);
	scatterplot.append("text")
	    .attr("id", "xaxis")
	    .attr("class", "axes")
	    .attr("x", w / 2)
	    .attr("y", h + pad.bottom * 0.7)
	    .text(data_keys[i])
	    .attr("dominant-baseline", "middle")
	    .attr("text-anchor", "middle")
	    .attr("fill", "slateblue");
	scatterplot.append("text")
	    .attr("id", "yaxis")
	    .attr("class", "axes")
	    .attr("x", -pad.left * 0.8)
	    .attr("y", h / 2)
	    .text(data_keys[j])
	    .attr("dominant-baseline", "middle")
	    .attr("text-anchor", "middle")
	    .attr("transform", "rotate(270,"
		  + (-pad.left * 0.8)
		  + ","
		  + (h / 2)
		  + ")")
	    .attr("fill", "slateblue");
	xticks = xScale.ticks(5);
	yticks = yScale.ticks(5);
	scatterplot.selectAll("empty")
	    .data(xticks).enter()
	    .append("text")
	    .attr("class", "axes")
	    .text(function(d) {
		return d3.format(".2f")(d);
	    }).attr("x", function(d) {
		return xScale(d);
	    }).attr("y", h + pad.bottom * 0.3)
	    .attr("dominant-baseline", "middle")
	    .attr("text-anchor", "middle");
	scatterplot.selectAll("empty")
	    .data(yticks)
	    .enter()
	    .append("text")
	    .attr("class", "axes")
	    .text(function(d) {
		return d3.format(".2f")(d);
	    }).attr("x", -pad.left * 0.1)
	    .attr("y", function(d) {
		return yScale(d);
	    }).attr("dominant-baseline", "middle")
	    .attr("text-anchor", "end");
	scatterplot.selectAll("empty")
	    .data(xticks).enter()
	    .append("line")
	    .attr("class", "axes")
	    .attr("x1", function(d) {
		return xScale(d);
	    }).attr("x2", function(d) {
		return xScale(d);
	    }).attr("y1", 0)
	    .attr("y2", h)
	    .attr("stroke", "white")
	    .attr("stroke-width", 1);
	scatterplot.selectAll("empty")
	    .data(yticks).enter()
	    .append("line")
	    .attr("class", "axes")
	    .attr("y1", function(d) {
		return yScale(d);
	    }).attr("y2", function(d) {
		return yScale(d);
	    }).attr("x1", 0)
	    .attr("x2", w)
	    .attr("stroke", "white")
	    .attr("stroke-width", 1);
	return scatterplot.selectAll("empty")
	    .data(d3.range(Math.max(0, nind-lastsamples),
			   nind))
	    .enter()
	    .append("circle")
	    .attr("class", "points")
	    .attr("cx", function(d) {
		return xScale(data[data_keys[i]][d]);
	    }).attr("cy", function(d) {
		return yScale(data[data_keys[j]][d]);
	    }).attr("r", 3)
	    .attr("stroke", "black")
	    .attr("stroke-width", 1)
	    .attr("fill", "steelblue");
    };
};