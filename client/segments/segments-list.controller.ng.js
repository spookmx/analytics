'use strict'

angular.module('analyticsApp')
.controller('SegmentsListCtrl', function($scope) {
  $scope.page = 1;
  $scope.perPage = 3;
  $scope.sort = {name_sort : 1};
  $scope.orderProperty = '1';
  
  $scope.helpers({
    segments: function() {
      return Segments.find({}, {
        sort: $scope.getReactively('sort') 
      });
    },
    segmentsCount: function() {
      return Counts.get('numberOfSegments');
    }
  });
                  
  $scope.subscribe('segments', function() {
    return [{
      sort: $scope.getReactively('sort'),
      limit: parseInt($scope.getReactively('perPage')),
      skip: ((parseInt($scope.getReactively('page'))) - 1) * (parseInt($scope.getReactively('perPage')))
    }, $scope.getReactively('search')];
  });

  $scope.save = function() {
    if ($scope.form.$valid) {
      Segments.insert($scope.newSegment);
      $scope.newSegment = undefined;
    }
  };
                  
  $scope.remove = function(segment) {
    Segments.remove({_id:segment._id});
  };
                  
  $scope.pageChanged = function(newPage) {
    $scope.page = newPage;
  };
                  
  return $scope.$watch('orderProperty', function() {
    if ($scope.orderProperty) {
      $scope.sort = {
        name_sort: parseInt($scope.orderProperty)
      };
    }
  });
});