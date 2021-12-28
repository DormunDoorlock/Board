const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.main =async(event, context)=> {

    const params ={
        TableName: "Board",
        // Difference" this is not item but key!
        Key: {
            BoardId: "3",
            name: event.pathParameters.id
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