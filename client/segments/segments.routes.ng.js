'use strict'

angular.module('analyticsApp')
.config(function($stateProvider) {
  $stateProvider
  .state('segments-list', {
    url: '/segments',
    templateUrl: 'client/segments/segments-list.view.ng.html',
    controller: 'SegmentsListCtrl',
    resolve: {
      currentUser: ['$meteor', function($meteor) {
        return $meteor.requireUser();
      }]
    }
  })
  .state('segment-detail', {
    url: '/segments/:segmentId',
    templateUrl: 'client/segments/segment-detail.view.ng.html',
    controller: 'SegmentDetailCtrl',
    resolve: {
      currentUser: ['$meteor', function($meteor) {
        return $meteor.requireUser();
      }]
    }
  });
});