'use strict';

app.directive('energyGraph', function($interval) {
    return {
        restrict: 'E',
        templateUrl: 'templates/energyGraph.html',
        link: function(scope, element, attrs) {

            //building graph
            //build off of viewport width

            scope.buildGraph = function(energyData) {
                var data = energyData;

                // var max = d3.max(data, function(d) {
                //     return d.date;
                // });

                // var min = d3.min(data, function(d) {
                //     return d.date;
                // });

                // var n = scope.testData.data.length,
                // random = d3.random.normal(0, .2),
                // var data = scope.testData.data;

                var margin = {
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 40
                    },
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;


                var startTime = new Date();
                startTime.setHours(0);
                startTime.setMinutes(0);

                var endTime = new Date();
                endTime.setHours(23);
                endTime.setMinutes(59);

                var x = d3.time.scale()
                    // .domain([min, max])
                    .domain([startTime, endTime])
                    .range([0, width]);

                var y = d3.scale.linear()
                    .domain([0, 20])
                    .range([height, 0]);

                var line = d3.svg.line()
                    .x(function(d, i) {
                        return x(d.date);
                    })
                    .y(function(d, i) {
                        return y(d['NYC Office']);
                    });

                var zoom = d3.behavior.zoom()
                    .x(x)
                    // .y(y)
                    .scaleExtent([1, 1400])
                    .on("zoom", draw);

                var svg = d3.select("#graphContainer").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(zoom);

                svg.append("rect") //has to be here for zooming
                    .attr("width", width)
                    .attr("height", height)
                    .style('fill', 'white');

                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                // var xAxis = svg.append("g")
                //     .attr("class", "x axis")
                //     .attr("transform", "translate(0," + y(0) + ")")
                //     .call(d3.svg.axis().scale(x).orient("bottom"));

                var xAxisZoom = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    // .tickSize(-height);

                svg.append('g')
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + y(0) + ")")
                    .call(xAxisZoom)

                svg.append("g")
                    .attr("class", "y axis")
                    .call(d3.svg.axis().scale(y).orient("left"));

                // var yAxisZoom = d3.svg.axis()
                //     .scale(y)
                //     .orient("left")
                //     .ticks(5)

                // svg.append('g')
                //     .attr("class","y axis")
                //     .call(yAxisZoom)    

                // function zoomed() {
                //     svg.select(".x.axis").call(xAxisZoom);
                //     // svg.select(".y.axis").call(yAxis);
                // }


                svg.append('path')
                    .attr('class', 'line')
                    .attr("clip-path", "url(#clip)")
                    // .datum(data)
                    // .attr('d', line)

                svg.select('path.line').data([data])

                draw();
                function draw() {
                    svg.select("g.x.axis").call(xAxisZoom);
                    // svg.select("g.y.axis").call(yAxis);
                    // svg.select("path.area").attr("d", area);
                    svg.select("path.line").attr("d", line);
                }

                // var path = svg.append("g")
                //     .attr("clip-path", "url(#clip)")
                //     .append("path")
                //     .datum(data)
                //     .attr("class", "line")
                //     .attr("d", line);
                // .on('mouseover',function(d){
                //     console.log('mouseover ',d)
                // })

                scope.tick = function() {

                    var duration = 60000;
                    // push a new data point onto the back
                    data = scope.energyData;

                    var newData = scope.tickDataArray.shift()

                    data.push(newData);


                    // var distanceBetweenTicks = x(data[1].date) - x(data[2].date)

                    //for using d3.zoom, later
                    // var totalDistance = x(data[0].date) - x(data[data.length-1].date)

                    // redraw the line, and slide it to the left
                    
                    var path =svg.select('path.line');
                    path
                        .data([data])
                        .attr("d", line)
                        .attr("transform", null)
                        .transition()
                        .duration(duration)
                        .ease("linear")
                        // .attr("transform", "translate(" + (distanceBetweenTicks) + ",0)")
                        .each("end", scope.tick);
                    // console.log('TOTAL DIST ',totalDistance/data.length


                    //rescaling has to be done after path draw
                    // x = d3.time.scale()
                    //     //adding newest date to x axis scaling
                    //     //figure out how to get behavior.zoom to work
                    //     .domain([data[1].date, data[data.length - 1].date])
                    //     .range([0, width]);

                    //Slides axes left 1 minute
                    //No need with Zoom
                    // xAxis
                    //     .transition()
                    //     .duration(duration)
                    //     .ease('linear')
                    //     // .attr("transform", "translate(0," + y(0) + ")")
                    //     .call(d3.svg.axis().scale(x).orient("bottom"));


                    //console.log(xAxis.call(d3.svg.axis().scale(x)))

                    //pop the old data point off the front
                    data.shift();

                }
            }
        }
    }
});