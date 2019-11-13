import DynamoDB = require('aws-sdk/clients/dynamodb')

const dynamoDb = new DynamoDB.DocumentClient()

interface Params {
    TableName: any
}

export const scan = (params: Params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await dynamoDb.scan(params).promise()
            resolve(response.Items)
        } catch (err) {
            reject(err)
        }
    })
}
