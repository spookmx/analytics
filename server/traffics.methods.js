//import Report from 'nomniture';

Meteor.methods({
  'traffic.daily'({date, adobeID}) {
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
            id:"event15"
          },{
            id:"event11"
          },{
            id:"event1"
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
      "dataStatus.traffic.date": new Date(moment(date).toDate())
    },{
      $set:{
        "dataStatus.traffic.$.daily":1
      }
    });
    var r = new Report('api_user:Freescale', '54a6f1abf46261c55f0ad2bead69c76d', 'dallas', options);
    r.request("Report.Queue", reportData, Meteor.bindEnvironment(function(err, response){
      if(err){
        //console.error("Report not ready");
        return;
      }else{
        Segments.update({
          adobeID: adobeID,
          "dataStatus.traffic.date": new Date(moment(date).toDate())
        },{
          $set:{
            "dataStatus.traffic.$.daily":2
          }
        });
        response.report.data.forEach(function(v){
          //console.log(v.name, adobeID);
          Traffics.update({
            adobeID: adobeID
          },{
            $pull:{
                "data.daily":{
                  date: new Date(v.year+"-"+v.month+"-"+v.day)
              }
            }
          });
          Traffics.update({
            adobeID: adobeID
          },{
            $push:{
                "data.daily":{
                  date: new Date(v.year+"-"+v.month+"-"+v.day),
                  visits: parseInt(v.counts[0]),
                  pageviews: parseInt(v.counts[1]),
                  uniquevisitors: parseInt(v.counts[2]),
                  downloadsinitiated: parseInt(v.counts[3]),
                  downloads: parseInt(v.counts[4]),
                  internalsearches: parseInt(v.counts[5])
              }
            }
          },{
            upsert:true
          });
        });
      }
    }));
    return r;
  },
  'traffic.monthly'({date, adobeID}) {
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
            id:"event15"
          },{
            id:"event11"
          },{
            id:"event1"
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
      "dataStatus.traffic.date": new Date(moment(date).toDate())
    },{
      $set:{
        "dataStatus.traffic.$.monthly":1
      }
    });
    var r = new Report('api_user:Freescale', '54a6f1abf46261c55f0ad2bead69c76d', 'dallas', options);
    r.request("Report.Queue", reportData, Meteor.bindEnvironment(function(err, response){
      if(err){
        //console.error("Report not ready");
        return;
      }else{
        Segments.update({
          adobeID: adobeID,
          "dataStatus.traffic.date": new Date(moment(date).toDate())
        },{
          $set:{
            "dataStatus.traffic.$.monthly":2
          }
        });
        response.report.data.forEach(function(v){
          //console.log(r.reportID, v.name);
          Traffics.update({
            adobeID: adobeID
          },{
            $pull:{
                "data.monthly":{
                  date: new Date(v.year+"-"+v.month+"-"+v.day)
              }
            }
          });
          Traffics.update({
            adobeID: adobeID
          },{
            $push:{
                "data.monthly":{
                  date: new Date(v.year+"-"+v.month+"-"+v.day),
                  visits: parseInt(v.counts[0]),
                  pageviews: parseInt(v.counts[1]),
                  uniquevisitors: parseInt(v.counts[2]),
                  downloadsinitiated: parseInt(v.counts[3]),
                  downloads: parseInt(v.counts[4]),
                  internalsearches: parseInt(v.counts[5])
              }
            }
          },{
            upsert:true
          });
        });
      }
    }));
    return r;
  }
});
