//Keywords only apply for the main NXP segment
Meteor.methods({
  'keywords.getData' (options){
    if(options.granularity == "daily"){
      var pipeline = [
        { $match: {'name': {'$regex': '.*' + options.search + '.*','$options': 'i'}}},
        { $limit : parseInt(options.limit) },
        { $unwind:"$data.daily"},
        { $match: { "data.daily.date": {"$gte": options.dateStart, "$lte": options.dateEnd} } },
        { $sort: {"name":1, "data.daily.date":1}},
        { $project : { "name": 1 , "data.daily" : 1 } }
      ];
      var result = Keywords.aggregate(pipeline);
    }else if(options.granularity == "monthly"){
      var pipeline = [
        { $match: {'name': {'$regex': '.*' + options.search + '.*','$options': 'i'}}},
        { $limit : parseInt(options.limit) },
        { $unwind:"$data.monthly"},
        { $match: { "data.monthly.date": {"$gte": options.dateStart, "$lte": options.dateEnd} } },
        { $sort: {"name":1, "data.monthly.date":1}},
        { $project : { "name": 1 , "data.monthly" : 1 } }
      ];
      var result = Keywords.aggregate(pipeline);
    }else{
      var pipeline = [
        { $match: {'name': {'$regex': '.*' + options.search + '.*','$options': 'i'}}},
        { $limit : parseInt(options.limit) },
        { $unwind:"$data.daily"},
        { $match: { "data.daily.date": {"$gte": options.dateStart, "$lte": options.dateEnd} } },
        { $group: {
          _id: "$name",
          "name": { "$first": "$name"},
          "visits": { "$sum": "$data.daily.visits" },
          "pageviews": { "$sum": "$data.daily.pageviews" },
          "uniquevisitors": { "$sum": "$data.daily.uniquevisitors" }
        }},
        { $sort: {"_id":1}},
      ];
      var result = Keywords.aggregate(pipeline);
      result.forEach(function(v, i){
        result[i] = {
          name: v._id,
          data:{
            aggregated:{
              searches: v.searches,
            }
          }
        };
      });
    }
    return result;
  },
  'keywords.daily'({date, adobeID}) {
    var Report = require('nomniture').Report;
    var moment = require('moment');
    var reportData = {
      reportDescription: {
        reportSuiteID: "freescaleprod",
        date: date,
        dateGranularity: "day",
        metrics: [
          {
            id:"event1"
          }
        ],
        elements:[
          {
            id:"prop4",
            top:"50000"
          }
        ],
    		segments:[
    			{
    				id:"s5384_55a7e7a8e4b0637130028ce1",
    			}
  		]
      }
    };
    var options = {
      version:1.4,
      waitTime:30
    }

    Segments.update({
      adobeID: adobeID,
      "dataStatus.keywords.date": new Date(moment(date).toDate())
    },{
      $set:{
        "dataStatus.keywords.$.daily":1
      }
    });
    var r = new Report(Meteor.settings.omnitureUser, Meteor.settings.omniturePass, Meteor.settings.omnitureRegion, options);
    r.request("Report.Queue", reportData, Meteor.bindEnvironment(function(err, response){
      if(err){
        //console.error("Report not ready");
        return;
      }else{
        Segments.update({
          adobeID: adobeID,
          "dataStatus.keywords.date": new Date(moment(date).toDate())
        },{
          $set:{
            "dataStatus.keywords.$.daily":2
          }
        });
        response.report.data.forEach(function(d){
          d.breakdown.forEach(function(c){
            //If there is no count that day it doenst make sense to store it
            if(parseInt(c.counts[0])>0){
              Keywords.update({
                keyword: c.name
              },{
                $addToSet:{
                    "data.daily":{
                      date: new Date(d.year+"-"+d.month+"-"+d.day),
                      searches: parseInt(c.counts[0])
                  }
                }
              },{
                upsert:true
              });
            }
          });
        });
      }
    }));
    return r;
  },
  'keywords.monthly'({date, adobeID}) {
    var Report = require('nomniture').Report;
    var moment = require('moment');
    var reportData = {
      reportDescription: {
        reportSuiteID: "freescaleprod",
        date: date,
        dateGranularity: "month",
        metrics: [
          {
            id:"event1"
          }
        ],
        elements:[
          {
            id:"prop4",
            top:"50000"
          }
        ],
        segments:[
          {
            id:"s5384_55a7e7a8e4b0637130028ce1",
          }
      ]
      }
    };
    var options = {
      version:1.4,
      waitTime:10
    }

    Segments.update({
      adobeID: adobeID,
      "dataStatus.keywords.date": new Date(moment(date).toDate())
    },{
      $set:{
        "dataStatus.keywords.$.monthly":1
      }
    });
    var r = new Report(Meteor.settings.omnitureUser, Meteor.settings.omniturePass, Meteor.settings.omnitureRegion, options);
    r.request("Report.Queue", reportData, Meteor.bindEnvironment(function(err, response){
      if(err){
        //console.error("Report not ready");
        return;
      }else{
        Segments.update({
          adobeID: adobeID,
          "dataStatus.keywords.date": new Date(moment(date).toDate())
        },{
          $set:{
            "dataStatus.keywords.$.monthly":2
          }
        });
        response.report.data.forEach(function(d){
          d.breakdown.forEach(function(c){
            Keywords.update({
              keyword: c.name
            },{
              $addToSet:{
                  "data.monthly":{
                    date: new Date(d.year+"-"+d.month+"-"+d.day),
                    searches: parseInt(c.counts[0])
                }
              }
            },{
              upsert:true
            });
          });
        });
      }
    }));
    return r;
  }
});
