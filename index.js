var AWS = require('aws-sdk');
// import {AWS} from 'aws-sdk';

var blueLineTravelTimesMap = require('./blueLineTravelTimesDict.js')
// import {blueLineTravelTimesMap} from './blueLineTravelTimesDict.js';

exports.handler = async (event, context, callback) => {
  const dynamodbClient = new AWS.DynamoDB.DocumentClient();
  var blueline = blueLineTravelTimesMap;
  console.log(blueLineTravelTimesMap instanceof Map);
  for (const entry of blueline.entries()) {
    // console.log(entry[0])
    // console.log(entry[1])
    
    var params = {
    Item : {
      "Trip" : entry[0],
      "Time" : entry[1]
      },
    TableName : 'MBTA_Stops'
    };
    // console.log("Hello world")
    try {
      await dynamodbClient.put(params).promise();
      console.info('successfully update to dynamodb', params)
    } catch (err) {
      console.info('failed adding data dynamodb', err)
    }
    // dynamodbClient.put(params).promise()
    //   .then((data) => {
    //       console.info('successfully update to dynamodb', params)
    //   })
    //   .catch((err) => {
    //       console.info('failed adding data dynamodb', err)
    //   });
  }
  
  
}

