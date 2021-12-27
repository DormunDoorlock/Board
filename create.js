const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.main =async(event, context)=> {

    let data=JSON.parse(event.body);
    data=JSON.parse(data.body);
    console.log(data);

    const params ={
        TableName: "Board",
        Item: {
            BoardId: "3",
            name: data.name,
            content: data.content,
            createAt: Date.now()
        }
    };

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      };
    try {
        await dynamoDb.put(params).promise();
    
        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(params.Item),
        };
      } catch (e) {
        return {
          statusCode: 500,
          headers: headers,
          body: JSON.stringify({ error: e.message }),
        };
      } 
};