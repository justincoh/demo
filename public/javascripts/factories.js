'use strict';

app.factory('placeholder',function($resource){
    return $resource('/placeholder');
});
