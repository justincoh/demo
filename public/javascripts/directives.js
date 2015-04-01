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


                var maxPower = d3.max(data,function(d){
                    return data['NYC Office']
                });
                var minPower = d3.min(data,function(d){
                    return data['NYC Office']
                });

                var y = d3.scale.linear()
                .domain([0,20])
                    // .domain([minPower*.9, maxPower*1.1])
                    .range([height, 0]);

                var line = d3.svg.line()
                    // .interpolate(function(d,i){

                    //     console.log('interpolator d',d)
                    //     console.log('interpolator i',i)
                    //     return 
                    //     // return 'basis'
                    // }) 
                    //interpolator has to go in here, 
                    //but has to be based off of index in data
                    .x(function(d, i) {
                        // console.log('dx',d)
                        // console.log('ix',i)
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
                    console.log('HIT', Date())

                    var duration = 60000;
                    // push a new data point onto the back
                    data = scope.energyData;
                    var newData = scope.tickDataArray.shift()
                    data.push(newData);

                    console.log('NEWDATA ', newData, x(newData.date), y(newData['NYC Office']))
                        // console.log('LINE ',line()(newData))
                        // need to interpolate from end of current path to this point


                    // var pathTween = function(d,i,a){
                    //     console.log('Tween this ',this)
                    //     return d3.interpolate()
                    // }


                    //return the path attr with new stuff concatted ont he end

                    var path = svg.select('path.line');
                    path
                        .datum(data)
                        .attr("d", line) //could throw an IF in here, based on data index TODO
                        // .attr("transform", null)
                        .transition()
                        .duration(duration)
                        // .attr('d',function(){
                        //     return path.attr('d').concat(x(newData.date),',',y(newData['NYC Office']))
                        // })
                        .ease("linear")
                        // .attrTween('d',pathTween)
                        // .attr("transform", "translate(" + (width/7) + ",0)") //moves the entire path
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
                    // data.shift();

                }
            }
        }
    }
});