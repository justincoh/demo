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
                    .x(function(d, i) {
                        return x(d.date);
                    })
                    .y(function(d, i) {
                        return y(d['NYC Office']);
                    })


                var zoom = d3.behavior.zoom()
                    .x(x)
                    // .y(y)
                    .scaleExtent([1, 144])
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


                    var rect = svg.append('rect')
                        .attr('class', 'cover')
                        .attr('x', rectPosition)
                        .attr('y', 0)
                        .attr("width", width - rectPosition)
                        .attr("height", height)
                        .style('fill', 'steelblue');
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
                    svg.select("g.x.axis").call(xAxisZoom);

                    // var times = scope.timesOnScope;
                    // var thirdToLast = times[times.length - 3];
                    // var rectPosition = x(new Date(thirdToLast))

                    // svg.select("g.y.axis").call(yAxis);
                    // svg.select("path.area").attr("d", area);
                    svg.select("path.line").attr("d", line);

                    // d3.select('rect.cover').remove(); //refactor this, too heavy
                    // var rect = svg.append("rect") //has to be here for zooming
                    //     .attr('class', 'cover')
                    //     .attr('x', rectPosition)
                    //     .attr('y', 0)
                    //     .attr("width", width - rectPosition)
                    //     .attr("height", height)
                    //     .style('fill', 'steelblue');


                    var pxDiff = x(new Date(scope.timesOnScope[1])) - x(new Date(scope.timesOnScope[0]))

                    //set the position of the rectangle based off a Date() originally
                    //and increment that date every X ms
                    //won't have to worry about re-drawing it on zoom cuz
                    //itll just happen anyway

                    //this needs to be based off of the end of the path data
                    //so it doesn't snap back every time you zoom
                    // rect  
                    //     .transition()
                    //     .duration(60000)
                    //     .ease('linear')
                    //     .attr("transform", "translate(" + (pxDiff) + ",0)")
                }

                scope.tick = function() {
                    console.log('HIT', Date())

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


                    //pop the old data point off the front
                    // data.shift();

                }
            }
        }
    }
});