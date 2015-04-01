'use strict';

app.controller('MainCtrl', function($scope, data,$interval) {
    

    var end = new Date(Date.now());
    var start = new Date(Date.now() - 600000); //600000 ms in 10 minutes

    //on scope because directive needs them in tick();
    $scope.endString = end.toISOString();
    $scope.startString = start.toISOString();


    // $interval(function(){
    // 	console.log('INTERVAL')
    // },10000)


    $scope.populate = function() {

        data.get({
        	startTime: startString,
        	endTime: endString,
        }, function(res) {
            res.data.forEach(function(dataPoint){
            	dataPoint.date = new Date(dataPoint.x)
            })
            $scope.energyData = res.data;
            $scope.buildGraph($scope.energyData) //comes from directive
            startString=endString;
        })
    }




    // $scope.testData = {
    //     units: 'kW',
    //     data: [{
    //             'NYC OfficeTotalCost': 0,
    //             x: '2015-03-31T20:47:00Z',
    //             'NYC Office': 0
    //         }, {
    //             'NYC OfficeTotalCost': 0.0269,
    //             x: '2015-03-31T20:48:00Z',
    //             'NYC Office': 7.6819
    //         }, {
    //             'NYC OfficeTotalCost': 0.0268,
    //             x: '2015-03-31T20:49:00Z',
    //             'NYC Office': 7.6571
    //         }, {
    //             'NYC OfficeTotalCost': 0.0271,
    //             x: '2015-03-31T20:50:00Z',
    //             'NYC Office': 7.7314
    //         }, {
    //             'NYC OfficeTotalCost': 0.0266,
    //             x: '2015-03-31T20:51:00Z',
    //             'NYC Office': 7.5884
    //         }, {
    //             'NYC OfficeTotalCost': 0.0268,
    //             x: '2015-03-31T20:52:00Z',
    //             'NYC Office': 7.6683
    //         }, {
    //             'NYC OfficeTotalCost': 0.0268,
    //             x: '2015-03-31T20:53:00Z',
    //             'NYC Office': 7.6425
    //         }, {
    //             'NYC OfficeTotalCost': 0.0317,
    //             x: '2015-03-31T20:54:00Z',
    //             'NYC Office': 9.0627
    //         }, {
    //             'NYC OfficeTotalCost': 0.0579,
    //             x: '2015-03-31T20:55:00Z',
    //             'NYC Office': 10.5323
    //         }
    //         // , {  //Cutting out for graph update testing later
    //         //     'NYC OfficeTotalCost': 0.0033,
    //         //     x: '2015-03-31T20:56:00Z',
    //         //     'NYC Office': 0.9422
    //         // }
    //     ],
    //     names: ['NYC Office']
    // }

});