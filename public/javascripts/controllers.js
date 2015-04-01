'use strict';

app.controller('MainCtrl', function($scope, data, $interval) {



    // var $scope.timesOnScope={};
    $scope.timesOnScope = [];
    //for preventing dupes later, am going to have to overlap request 
    //and filter dupes due to weird api responses

    $scope.populate = function() {
        var end = new Date(Date.now() - 120000); //offsetting by 2 minute to make sure the data is really there
        // var start = new Date(Date.now() - 900000); //900000 ms in 15 minutes
        var start = new Date();
        start.setHours(16);
        start.setMinutes(35);

        data.get({
            startTime: start.toISOString(),
            endTime: end.toISOString()
        }, function(res) {
            res.data.forEach(function(dataPoint) {
                dataPoint.date = new Date(dataPoint.x);
                // $scope.timesOnScope[dataPoint.x]=1;
                $scope.timesOnScope.push(dataPoint.x);
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

            if (typeof res.data !== 'undefined') {
                res.data.forEach(function(dataPoint) {
                    // if($scope.timesOnScope.hasOwnProperty(dataPoint.x)){
                    if ($scope.timesOnScope.indexOf(dataPoint.x) !== -1) {
                        // console.log('dataPoint already exists', dataPoint)
                    } else {
                        dataPoint.date = new Date(dataPoint.x)
                            // $scope.timesOnScope[dataPoint.x] = 1;
                        $scope.timesOnScope.push(dataPoint.x)
                        $scope.tickDataArray.push(dataPoint);
                        console.log('PUSHED ', dataPoint)
                    }
                })
            } else{
                console.log('BAD RES ',res)
            }


        })
    }
    $interval($scope.testGet, 120000)

});