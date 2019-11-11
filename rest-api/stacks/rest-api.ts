import cdk = require('@aws-cdk/core')
import lambda = require('@aws-cdk/aws-lambda')
import dynamodb = require('@aws-cdk/aws-dynamodb')

import fs = require('fs')

export class RestApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const moviesDynamoDBTable = new dynamodb.Table(this, 'movies-dynamodb-table', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            pointInTimeRecovery: true,
            tableName: 'cdk-rest-api-movies'
        }) 

        const getAllMoviesFunction = new lambda.Function(this, 'get-all-movies-lambda-function', {
            code: new lambda.InlineCode(fs.readFileSync('./lambda/handler.js', { encoding: 'utf-8' })),
            handler: 'index.getAllMovies',
            timeout: cdk.Duration.seconds(300),
            runtime: lambda.Runtime.NODEJS_8_10,
            environment: {
                'MOVIES_TABLE_NAME': moviesDynamoDBTable.tableName
            }
        })
    }
}
