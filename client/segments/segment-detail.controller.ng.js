'use strict'

angular.module('analyticsApp')
.controller('SegmentDetailCtrl', function($scope, $stateParams) {
  $scope.selectedDimension = 'traffic';
  var moment = require('moment');

  $scope.segmentUpdate = function(){
    angular.forEach($scope.segment.dataStatus[$scope.selectedDimension], function(status){
      Meteor.call($scope.selectedDimension+'.daily', {date: moment(status.date).format('YYYY-MM'), adobeID:$scope.segment.adobeID});
      Meteor.call($scope.selectedDimension+'.monthly', {date: moment(status.date).format('YYYY-MM'), adobeID:$scope.segment.adobeID});
    });
  };

  $scope.initializeStatus = function(){
    $scope.dateTraverse = moment("2016-01-01");
    $scope.dateToday = moment();
    $scope.segment.dataStatus = {traffic:[], languages:[], pages:[], actions:[], keywords:[], downloads:[] , countries:[]};
    do {
      angular.forEach($scope.segment.dataStatus, function(val, key){
        var element = {date:new Date($scope.dateTraverse.toDate()), monthly: 0, daily: 0};
        $scope.segment.dataStatus[key].push(element);
      });
      $scope.dateTraverse.add(1, 'month');
    } while ($scope.dateToday.diff($scope.dateTraverse, 'months') > 0);
    $scope.save();
  };


  $scope.helpers({
    segment: function() {
      return Segments.findOne({ _id: $stateParams.segmentId });
    }
  });

  $scope.subscribe('segments');

  $scope.$watch('segment', function() {
    //&& !$scope.segment.dataStatus
    $scope.segment && !$scope.segment.dataStatus ? $scope.initializeStatus() : null;
  });

  $scope.save = function() {
    if($scope.form.$valid) {
      delete $scope.segment._id;
      Segments.update({
        _id: $stateParams.segmentId
      }, {
        $set: $scope.segment
      }, function(error) {
        if(error) {
          console.log('Unable to update the segment');
        } else {
          console.log('Segment updated!');
        }
      });
    }
  };

  $scope.reset = function() {
    $scope.segment.reset();
  };
});
