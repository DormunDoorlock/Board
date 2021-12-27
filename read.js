const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.main =async(event, context)=> {

    const params ={
        TableName: "Board",
        Key: {
            BoardId: String(event.pathParameters.id),
            name: "helloworld"
        }
    };


    const result= await dynamoDb.get(params).promise();
    console.log(result);

    if(!result.Item){
        throw new Error("Item not found");
    }

    return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
    };
      
};