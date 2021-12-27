const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.main =async(event, context)=> {

    let data=JSON.parse(event.body);
    data=JSON.parse(data.body);
    console.log(data);

    const params ={
        TableName: "Board",
        
        Item: {
            BoardId: String(event.pathParameters.id),
            name: data.name,
            content: data.content,
            createAt: Date.now()
        }
    };

    try {
        await dynamoDb.put(params).promise();
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