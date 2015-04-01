'use strict';

app.controller('MainCtrl', function($scope, data, $interval) {



    // var timesOnScope={};
    var timesOnScope = [];
    //for preventing dupes later, am going to have to overlap request 
    //and filter dupes due to weird api responses

    $scope.populate = function() {
        var end = new Date(Date.now() - 120000); //offsetting by 2 minute to make sure the data is really there
        var start = new Date(Date.now() - 900000); //900000 ms in 15 minutes

        data.get({
            startTime: start.toISOString(),
            endTime: end.toISOString()
        }, function(res) {
            res.data.forEach(function(dataPoint) {
                dataPoint.date = new Date(dataPoint.x);
                // timesOnScope[dataPoint.x]=1;
                timesOnScope.push(dataPoint.x);
            })
            $scope.allData = res.data;
            $scope.energyData = res.data.slice(1, res.data.length - 2);
            //slicing at [1] because the first dataPoint is always 0 for some reason

            $scope.tickDataArray = res.data.slice(res.data.length - 2)
            $scope.buildGraph($scope.energyData) //buildgraph comes from directive
            $scope.tick();

        })
    }

    $scope.testGet = function() {
        var now = new Date(Date.now());
        var fiveMinutes = new Date(Date.now() - 300000)
        data.get({
            startTime: fiveMinutes.toISOString(),
            endTime: now.toISOString()
        }, function(res) {
            res.data.forEach(function(dataPoint) {
                // if(timesOnScope.hasOwnProperty(dataPoint.x)){
                if (timesOnScope.indexOf(dataPoint.x) !== -1) {
                    // console.log('dataPoint already exists', dataPoint)
                } else {
                    dataPoint.date = new Date(dataPoint.x)
                    // timesOnScope[dataPoint.x] = 1;
                    timesOnScope.push(dataPoint.x)
                    $scope.tickDataArray.push(dataPoint);
                    // console.log('PUSHED ', dataPoint)
                }
            });

        })
    }
    $interval($scope.testGet, 120000)

});