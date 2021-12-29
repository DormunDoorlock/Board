const AWS = require('aws-sdk');
//const {"v4": uuidv4} = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const {DYNAMODB_TABLE} = process.env;

exports.handle =async(event, context)=> {

    const handler = event.httpMethod;
    // CREATE
    if(handler=="POST"){
        let data=JSON.parse(event.body)
        const {BoardName,BoardContent} = data
        var now = new Date()

        const params ={
           TableName: DYNAMODB_TABLE,
            Item: {
               BoardType: event.pathParameters.type,
               BoardId: context.awsRequestId,
               BoardName,
               BoardContent,
              CreateAt: now.toLocaleString(),
              Sort:0
           }
        };

        try {
            const result = await dynamoDb.put(params).promise();
            console.log(result);
            return {
             statusCode: 200,
             body: JSON.stringify(result.Item),
            };
        } catch (e) {
            return {
             statusCode: 500,
             body: JSON.stringify({ error: e.message }),
            };
        }  
    }
    // READ
    if(handler=='GET'){

        const params ={
            TableName: DYNAMODB_TABLE,
            Key: {
                BoardType: event.pathParameters.type,
                BoardId: event.pathParameters.id
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
    }
    // UPDATE
    if(handler=='PUT'){
        let data=JSON.parse(event.body);

        var now = new Date();

        const params ={
            TableName: DYNAMODB_TABLE,
        
            Key: {
                BoardType: event.pathParameters.type,
                BoardId: event.pathParameters.id
            },

            UpdateExpression: "SET BoardContent = :content, modifyAt = :modifyAt",

            ExpressionAttributeValues: {
            ":modifyAt": now.toLocaleString() || null,
            ":content": data.BaordContent || null,
            },

            ReturnValues: "ALL_NEW",
        };

        try {
            await dynamoDb.update(params).promise();
            return {
                statusCode: 200,
                body: JSON.stringify({ status: true }),
            };
        }catch (e) {
            return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
            };
        }    
    }
    // DELETE
    if(handler=='DELETE'){
        const params ={
            TableName: DYNAMODB_TABLE,
            
            Key: {
                BoardType: event.pathParameters.type,
                BoardId: event.pathParameters.id
            }
        };
        try {
            await dynamoDb.delete(params).promise();
            return {
              statusCode: 200,
              body: JSON.stringify({ status: true }),
            };
        }catch (e) {
            return {
              statusCode: 500,
              body: JSON.stringify({ error: e.message }),
            };
        }
    }
};

exports.search =async(event, context)=>{
    const params={
        TableName: DYNAMODB_TABLE,
        IndexName: "BoardIdIndex",
        KeyConditionExpression: "Sort = :sort",
        ExpressionAttributeValues: {
            ':sort' : 0
        },
        ScanIndexForward: false
    };
    try{
    const result= await dynamoDb.query(params).promise();
    console.log(result.Items);
    const data=result.Items;
    return {
        statusCode: 200,
        body: JSON.stringify({data}),
      };
    }catch(e){
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
          };
    }
};

exports.searchoption =async(event, context)=>{
    let data=JSON.parse(event.body);
    const {BoardName} = data;
    console.log(data);
    if (BoardName != undefined){
        const params={
            TableName: DYNAMODB_TABLE,
            IndexName: "NameSearchIndex",
            KeyConditionExpression: "BoardName = :name",
            ExpressionAttributeValues: {
                ':name' : BoardName
            },
        };
        try{
            const result= await dynamoDb.query(params).promise();
            console.log(result);
            const data1=result.Items;
            return {
                statusCode: 200,
                body: JSON.stringify({data1}),
            };
        }catch(e){
            return {
                statusCode: 500,
                body: JSON.stringify({ error: e.message }),
             };
        }
    }
    else{
        let data2 =JSON.parse(event.body);
        const {BoardContent} = data2;
        const KEYWORD=BoardContent;
        const params={
            TableName: DYNAMODB_TABLE,
            IndexName: "ContentSearchIndex",
            KeyConditionExpression: "Sort = :sort",
            FilterExpression: "contains(BoardContent, :boardContent)",
            ExpressionAttributeValues: {
                ':sort' : 0,
                ':boardContent' : KEYWORD
            },
        }
        try{
            const result= await dynamoDb.query(params).promise();
            console.log(result);
            const data3=result.Items;
            return {
                statusCode: 200,
                body: JSON.stringify({data3}),
              };
            }catch(e){
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: e.message }),
            };
        } 
    }
};



