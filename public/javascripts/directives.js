'use strict';

app.directive('energyGraph', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/energyGraph.html',
        link: function(scope, element, attrs) {

            //building graph
            //build off of viewport width
            scope.testData.data.forEach(function(obj) {
                obj.date = new Date(obj.x)
            })

            var max = d3.max(scope.testData.data, function(d) {
                return d.date;
            });

            var min = d3.min(scope.testData.data, function(d) {
                return d.date;
            });

            // var n = scope.testData.data.length,
                // random = d3.random.normal(0, .2),

            var data = scope.testData.data;

            var margin = {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 40
                },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var x = d3.time.scale()
                .domain([min, max])
                .range([0, width]);

            var y = d3.scale.linear()
                .domain([0, 12])
                .range([height, 0]);

            var line = d3.svg.line()
                .x(function(d, i) {
                    return x(d.date);
                })
                .y(function(d, i) {
                    return y(d['NYC Office']);
                });

            var svg = d3.select("#graphContainer").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            var xAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(d3.svg.axis().scale(x).orient("bottom"));

            svg.append("g")
                .attr("class", "y axis")
                .call(d3.svg.axis().scale(y).orient("left"));

            var path = svg.append("g")
                .attr("clip-path", "url(#clip)")
                .append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);



            scope.tick = function() {
                var duration = 1500;
                // push a new data point onto the back
                data.push({
                    'NYC OfficeTotalCost': 0.0033,
                    x: '2015-03-31T20:56:00Z',
                    date: new Date('2015-03-31T20:56:00Z'),
                    'NYC Office': 0.9422
                });

                var distanceBetweenTicks = x(data[1].date) - x(data[2].date)

                //for using d3.zoom, later
                // var totalDistance = x(data[0].date) - x(data[data.length-1].date)
                // console.log('TOTAL DIST ',totalDistance/data.length)


                // redraw the line, and slide it to the left
                path
                    .attr("d", line)
                    .attr("transform", null)
                    .transition()
                    .duration(duration)
                    .ease("linear")
                    .attr("transform", "translate(" + (distanceBetweenTicks) + ",0)")
                    // .each("end", tick);
                    
                x = d3.time.scale() 
                //adding newest date to x axis scaling
                //could also translate this the new intermediate tick distance
                //and have all times show with this graph just getting longer
                    .domain([data[1].date, data[data.length-1].date])
                    .range([0, width]);
                
                //Slides a new point onto the end of the graph
                    xAxis
                        .transition()
                        .duration(duration)
                        .ease('linear')
                        // .attr("transform", "translate(0," + y(0) + ")")
                        .call(d3.svg.axis().scale(x).orient("bottom"));
                    

                    // console.log(xAxis.call(d3.svg.axis().scale(x)))
                // pop the old data point off the front
                //figure out how to 
                data.shift();

            }




        }
    }
});