const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.main =async(event, context)=> {

    const params ={
        TableName: "Board",
        
        Key: {
            BoardId: "3",
            name: event.pathParameters.id
        }
    };
    try {
        await dynamoDb.delete(params).promise();
        return {
          statusCode: 200,
          body: JSON.stringify({ status: true }),
        };
      } catch (e) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: e.message }),
        };
      } 
    
};