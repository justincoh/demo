'use strict';

app.controller('MainCtrl', function($scope, data, $interval) {


    var end = new Date(Date.now()-60000); //offsetting by 1 minute to make sure the data is really there
    var start = new Date(Date.now() - 660000); //660000 ms in 11 minutes

    //Set up multiple arrays, so tick isn't ever waiting for anything
    //it can just shift the newest element off the beginning of the list
    //and requests are unrelated


    $scope.populate = function() {

        data.get({
            startTime: start.toISOString(),
            endTime: end.toISOString()
        }, function(res) {
            res.data.forEach(function(dataPoint) {
                dataPoint.date = new Date(dataPoint.x)
            })
            $scope.allData = res.data;
            $scope.energyData = res.data.slice(0, res.data.length - 1);
            // $scope.firstTickData=res.data.slice(res.data.length-1)[0];

            $scope.tickDataArray = res.data.slice(res.data.length - 1)
            $scope.buildGraph($scope.energyData) //buildgraph comes from directive
            $scope.tick();

        })
    }


    $scope.testGet = function() {
    	var now = new Date(Date.now());
        var minuteAgo = new Date(Date.now() - 60000)
        data.get({
            startTime: minuteAgo.toISOString(),
            endTime: now.toISOString()
        }, function(res) {
            res.data.forEach(function(dataPoint) {
                dataPoint.date = new Date(dataPoint.x)
            });
            console.log('Interval Data ',res.data)
            $scope.tickDataArray.push(res.data[0])
            $scope.allData.push(res.data[0])
            console.log('TICK DATA ',$scope.tickDataArray)
        })
    }
    $interval($scope.testGet,60000)
    
});