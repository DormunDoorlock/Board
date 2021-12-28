const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.main =async(event, context)=> {

    let data=JSON.parse(event.body);
    data=JSON.parse(data.body);
    console.log(data);

    var now = new Date();

    const params ={
        TableName: "Board",
        
        Key: {
            BoardId: String(event.pathParameters.id),
            name: data.name
        },

        UpdateExpression: "SET content = :content, createAt = :createAt",

        ExpressionAttributeValues: {
        ":createAt": now.toLocaleString() || null,
        ":content": data.content || null,
        },

        ReturnValues: "ALL_NEW",
    };

    try {
        await dynamoDb.update(params).promise();
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