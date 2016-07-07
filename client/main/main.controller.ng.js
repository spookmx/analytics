'use strict'

angular.module('analyticsApp')
.controller('MainCtrl', function($scope) {
  $scope.granularity = "aggregated";
  $scope.dateStart = new Date(2016,0,1);
  $scope.dateEnd = new Date(2016,0,3);
  $scope.limit = 10;
  $scope.pages = [];

  $scope.getData = function(){
    var options = {
      granularity: $scope.granularity,
      dateStart: $scope.dateStart,
      dateEnd: $scope.dateEnd,
      search: $scope.search,
      limit: $scope.limit
    };
    Meteor.call( 'pages.getData', options, ( error, response ) => {
    if ( error ) {
      console.error(error);
    } else {
      console.log(response);
      $scope.pages = response;
      $scope.$apply();
    }
  });
  };

});
