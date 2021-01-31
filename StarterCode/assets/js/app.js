// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group to the SVG area and shift
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data
d3.csv("assets/data/data.csv").then(function(stateData) {
//console.log(stateData);   
   
   // Parse Data
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([5, d3.max(stateData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.healthcare)])
      .range([height, 0]);

    // Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
       
    // Create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

       var circleLabels = chartGroup.selectAll(null).data(stateData).enter().append("text");
       
       circleLabels
           .attr("x", function(d) { return xLinearScale(d.poverty);
           })
           .attr("y", function(d) { return yLinearScale(d.healthcare);
           })
           .text(function(d) { return d.abbr; 
          })
           .attr("font-family", "sans-serif")
           .attr("font-size", "5px")
           .attr("text-anchor", "middle")
           .attr("fill", "white");

    // Initialize tool tip
    var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
               return `${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`
            });
    
    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(d) {
                          toolTip.show(d, this)
                })
                .on("mouseout", function(d) {
                    toolTip.hide(d);
                })

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .style("fill", "black")
      .style("font-weight", "bold")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width /2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .style("font", "20px sans-serif")
      .style("font-weight", "bold")
      .text("In Poverty (%)");

    }).catch(function(error) {
    console.log(error); 
   });

