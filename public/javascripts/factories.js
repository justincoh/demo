'use strict';

app.factory('data',function($resource){
    return $resource('/data');
});
