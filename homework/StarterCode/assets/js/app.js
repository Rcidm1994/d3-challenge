// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;
// Define the chart's margins as an object
var chartMargin = {
    top:30,
    right:30,
    bottom:30,
    left:30
};
// Define dimensions of the chart area
var chartWidth = svgWidth - (chartMargin.left + chartMargin.right);
var chartHeight = svgHeight - (chartMargin.top + chartMargin.bottom);
// Select id scatter, append SVG area to it, and set dimensions
var svg = d3
    .select('.scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);
// Append group element
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('id', 'chartArea');
// Read CSV
d3.csv('../data/data.csv').then(function(healthData) {
    // parse data
    healthData.forEach(function(data) {
        data.poverty =+ data.poverty;
        data.healthcare =+ data.healthcare;
    })
    // healthData.forEach(data => {
    //     data.poverty = +data.poverty;
    //     data.healthcare = +data.healthcare;
    // });
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty), 0])
        .range([0,chartWidth]);
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([chartHeight,0]);
    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);
    // append axes
    chartGroup.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(xAxis);
    chartGroup.append('g')
        .call(yAxis);
    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r','10')
        .attr('fill','blue')
        .attr('opacity','0.5');
    // initialize tooltip
    var toolTip = d3.tip()
        .attr('class','tooltip')
        .offset([80,-60])
        .html(function(d) {
            return (`${d.abbr}<br>Health Care: ${d.healthcare}<br>Poverty: ${d.poverty}`);
        });
    // create tooltip
    chartGroup.call(toolTip);
    // create event listeners to diplay and hide the tooltip
    circlesGroup.on('click', function(data) {
        toolTip.show(data, this);
    })
        .on('mouseout', function(data, index) {
            toolTip.hide(data);
        });
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - chartMargin + 40)
        .attr('x', 0 - (chartHeight / 2))
        .attr('dy','1em')
        .attr('class', 'axisText')
        .text('Health Care (%)')
    chartGroup.append('text')
        .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + chartMargin + 30})`)
        .attr('class', 'axisText')
        .text('Poverty (%)');
}).catch(function(error) {
    console.log(error);
});