const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.main =async(event, context)=> {

    const params ={
        TableName: "Board",
        
        Key: {
            BoardId: String(event.pathParameters.id),
            name: "hellworld"
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