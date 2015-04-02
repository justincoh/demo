'use strict';

app.directive('energyGraph', function($interval) {
    return {
        restrict: 'E',
        templateUrl: 'templates/energyGraph.html',
        link: function(scope, element, attrs) {

            //building graph
            //build off of viewport width
            var graphMin = new Date();
            graphMin.setHours(0);
            graphMin.setMinutes(0);

            var graphMax = new Date();
            graphMax.setHours(23);
            graphMax.setMinutes(59);

            scope.buildGraph = function(energyData) {
                var data = energyData;

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


                var maxPower = d3.max(data, function(d) {
                    return data['NYC Office']
                });
                var minPower = d3.min(data, function(d) {
                    return data['NYC Office']
                });

                var y = d3.scale.linear()
                    .domain([0, 20])
                    // .domain([minPower*.9, maxPower*1.1])
                    .range([height, 0]);

                var line = d3.svg.line()
                    .interpolate('cardinal')
                    .x(function(d, i) {
                        return x(d.date);
                    })
                    .y(function(d, i) {
                        return y(d['NYC Office']);
                    })


                var zoom = d3.behavior.zoom()
                    .x(x)
                    // .y(y)
                    // .xExtent([graphMin ,graphMax])  Not officially available yet
                    .scaleExtent([1, 288])
                    .on("zoom", draw);

                var svg = d3.select("#graphContainer").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(zoom);

                svg.append("rect") //has to be here for zooming
                    .attr('class', 'background')
                    .attr("width", width)
                    .attr("height", height)
                    .style('fill', 'white');

                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                var xAxisZoom = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")

                svg.append('g')
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + y(0) + ")")
                    .call(xAxisZoom)

                svg.append("g")
                    .attr("class", "y axis")
                    .call(d3.svg.axis().scale(y).orient("left"))
                    .append('text')
                    .text('kW')
                    .style('font-size','16px')
                    .attr('x',5)
                    .attr('y',5)
                
                // var yAxisZoom = d3.svg.axis()
                //     .scale(y)
                //     .orient("left")
                //     .ticks(5)

                // svg.append('g')
                //     .attr("class","y axis")
                //     .call(yAxisZoom)    


                svg.append('path')
                    .attr('class', 'line')
                    .attr("clip-path", "url(#clip)")
                    // .datum(data)
                    // .attr('d', line)

                svg.select('path.line').data([data])




                draw();



                function buildRectangle(dateObj){
                    d3.select('rect.cover').remove();
                    
                    var rectPosition = x(dateObj)

                    //fixing bug where rectangle is off screen
                    var rectWidth;
                    if(width-rectPosition<=0){
                        rectWidth = 0;
                    } else {
                        rectWidth = width-rectPosition
                    }

                    var rect = svg.append('rect')
                        .attr('class', 'cover')
                        .attr('x', rectPosition)
                        .attr('y', 0)
                        .attr("width", rectWidth)
                        .attr("height", height)
                        .style('fill', 'white');
                }


                var times = scope.timesOnScope;
                var thirdToLast = times[times.length - 3];
                var rectangleTime = new Date(thirdToLast);
                buildRectangle(rectangleTime);

                var intervalTimer = 50;
                $interval(function(){
                    var rect = svg.select('rect.cover')
                    rectangleTime.setTime(rectangleTime.getTime()+intervalTimer)
                    buildRectangle(rectangleTime)
                },intervalTimer)

                function draw() {
                    //if blocks handle zoom/pan limits
                    if(x.domain()[0]<startTime){
                        var k = zoom.translate()[0] - x(startTime)+x.range()[0];
                        zoom.translate([k,0]);
                    } else if(x.domain()[1]>endTime){
                        var k = zoom.translate()[0] - x(endTime) + x.range()[1];
                        zoom.translate([k, 0]);
                    }

                    svg.select("g.x.axis").call(xAxisZoom);
                    svg.select("path.line").attr("d", line);
                    
                }

                scope.tick = function() {
                    var duration = 60000;
                    // push a new data point onto the back
                    data = scope.energyData;
                    var newData = scope.tickDataArray.shift()
                    data.push(newData);

                    var path = svg.select('path.line');
                    path
                        .datum(data)
                        .attr("d", line)
                        .transition()
                        .duration(duration)
                        .ease("linear")
                        .each('end', scope.tick)
                }
            }
        }
    }
});