import cdk = require('@aws-cdk/core')
import dynamodb = require('@aws-cdk/aws-dynamodb')
import lambda = require('@aws-cdk/aws-lambda')
import iam = require('@aws-cdk/aws-iam')
import apigateway = require('@aws-cdk/aws-apigateway')

export class RestApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const stage = this.node.tryGetContext('stage')

        const moviesDynamoDBTable = new dynamodb.Table(
            this,
            `${stage}-movies-dynamodb-table`,
            {
                tableName: `${stage}-cdk-rest-api-movies`,
                partitionKey: {
                    name: 'id',
                    type: dynamodb.AttributeType.STRING
                },
                billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
                pointInTimeRecovery: true
            }
        )

        const lambdaExecutionRole = new iam.Role(
            this,
            `${stage}-lambda-execution-role`,
            {
                roleName: `${stage}-lambda-execution`,
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
                managedPolicies: [
                    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
                ],
                inlinePolicies: {
                    'test': new iam.PolicyDocument({
                        statements: [
                            new iam.PolicyStatement({
                                effect: iam.Effect.ALLOW,
                                resources: [moviesDynamoDBTable.tableArn],
                                actions: ['dynamodb:*']
                            })
                        ]
                    })
                }
            }
        )

        const getAllMoviesFunction = new lambda.Function(
            this,
            `${stage}-get-all-movies-lambda-function`,
            {
                functionName: `${stage}-get-all-movies-lambda`,
                role: lambdaExecutionRole,
                code: new lambda.AssetCode('src'),
                handler: 'handler.getAllMovies',
                runtime: lambda.Runtime.NODEJS_10_X,
                environment: {
                    MOVIES_TABLE_NAME: moviesDynamoDBTable.tableName
                }
            }
        )

        const api = new apigateway.RestApi(
            this,
            `${stage}-cdk-rest-api`,
            {
                restApiName: `${stage}-cdk-rest-api`
            }
        )

        const getAllMoviesApiResource = api.root.addResource('getAllMovies')
        const getAllMoviesIntegration = new apigateway.LambdaIntegration(getAllMoviesFunction)
        getAllMoviesApiResource.addMethod('GET', getAllMoviesIntegration)
    }
}
