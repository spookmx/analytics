//import Report from 'nomniture';

Meteor.methods({
  'countries.getData' (options){
    if(options.granularity == "daily"){
      var pipeline = [
        { $match: {'name': {'$regex': '.*' + options.search + '.*','$options': 'i'}}},
        { $limit : parseInt(options.limit) },
        { $unwind:"$data.daily"},
        { $match: { "data.daily.date": {"$gte": options.dateStart, "$lte": options.dateEnd} } },
        { $sort: {"name":1, "data.daily.date":1}},
        { $project : { "name": 1 , "data.daily" : 1 } }
      ];
      var result = Countries.aggregate(pipeline);
    }else if(options.granularity == "monthly"){
      var pipeline = [
        { $match: {'name': {'$regex': '.*' + options.search + '.*','$options': 'i'}}},
        { $limit : parseInt(options.limit) },
        { $unwind:"$data.monthly"},
        { $match: { "data.monthly.date": {"$gte": options.dateStart, "$lte": options.dateEnd} } },
        { $sort: {"name":1, "data.monthly.date":1}},
        { $project : { "name": 1 , "data.monthly" : 1 } }
      ];
      var result = Countries.aggregate(pipeline);
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
      var result = Countries.aggregate(pipeline);
      result.forEach(function(v, i){
        result[i] = {
          name: v._id,
          data:{
            aggregated:{
              visits: v.visits,
              pageviews: v.pageviews,
              uniquevisitors:v.uniquevisitors
            }
          }
        };
      });
    }
    return result;
  },
  'countries.daily'({date, adobeID}) {
    var Report = require('nomniture').Report;
    var moment = require('moment');
    var reportData = {
      reportDescription: {
        reportSuiteID: "freescaleprod",
        date: date,
        dateGranularity: "day",
        metrics: [
          {
            id:"visits"
          },{
            id:"pageviews"
          },{
            id:"uniquevisitors"
          },{
    				id:"event11"
    			},{
    				id:"event15"
    			},{
    				id:"event1"
    			}
        ],
        elements:[
          {
            id:"geoCountry",
            top:"50000"
          }
        ],
    		segments:[
    			{
    				id:"s5384_55a7e7a8e4b0637130028ce1",
    			},{
    				id:"s5384_574f13e4e4b0b9f0025dc693",
    			},{
    				id:adobeID,
    			},
  		]
      }
    };
    var options = {
      version:1.4,
      waitTime:30
    }

    Segments.update({
      adobeID: adobeID,
      "dataStatus.countries.date": new Date(moment(date).toDate())
    },{
      $set:{
        "dataStatus.countries.$.daily":1
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
          "dataStatus.countries.date": new Date(moment(date).toDate())
        },{
          $set:{
            "dataStatus.countries.$.daily":2
          }
        });
        response.report.data.forEach(function(d){
          d.breakdown.forEach(function(c){
            Countries.update({
              adobeID: adobeID,
              country: c.name
            },{
              $addToSet:{
                  "data.daily":{
                    date: new Date(d.year+"-"+d.month+"-"+d.day),
                    visits: parseInt(c.counts[0]),
                    pageviews: parseInt(c.counts[1]),
                    uniquevisitors: parseInt(c.counts[2]),
                    downloadsinitiated: parseInt(c.counts[3]),
                    downloads: parseInt(c.counts[4]),
                    internalsearches: parseInt(c.counts[5])
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
  },
  'countries.monthly'({date, adobeID}) {
    var Report = require('nomniture').Report;
    var moment = require('moment');
    var reportData = {
      reportDescription: {
        reportSuiteID: "freescaleprod",
        date: date,
        dateGranularity: "month",
        metrics: [
          {
            id:"visits"
          },{
            id:"pageviews"
          },{
            id:"uniquevisitors"
          },{
            id:"event11"
          },{
            id:"event15"
          },{
            id:"event1"
          }
        ],
        elements:[
          {
            id:"geoCountry",
            top:"50000"
          }
        ],
        segments:[
          {
            id:"s5384_55a7e7a8e4b0637130028ce1",
          },{
            id:"s5384_574f13e4e4b0b9f0025dc693",
          },{
            id:adobeID,
          },
      ]
      }
    };
    var options = {
      version:1.4,
      waitTime:10
    }

    Segments.update({
      adobeID: adobeID,
      "dataStatus.countries.date": new Date(moment(date).toDate())
    },{
      $set:{
        "dataStatus.countries.$.monthly":1
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
          "dataStatus.countries.date": new Date(moment(date).toDate())
        },{
          $set:{
            "dataStatus.countries.$.monthly":2
          }
        });
        response.report.data.forEach(function(d){
          d.breakdown.forEach(function(c){
            Countries.update({
              adobeID: adobeID,
              country: c.name
            },{
              $addToSet:{
                  "data.monthly":{
                    date: new Date(d.year+"-"+d.month+"-"+d.day),
                    visits: parseInt(c.counts[0]),
                    pageviews: parseInt(c.counts[1]),
                    uniquevisitors: parseInt(c.counts[2]),
                    downloadsinitiated: parseInt(c.counts[3]),
                    downloads: parseInt(c.counts[4]),
                    internalsearches: parseInt(c.counts[5])
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
