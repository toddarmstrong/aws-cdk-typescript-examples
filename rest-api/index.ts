#!/usr/bin/env node
import 'source-map-support/register'
import cdk = require('@aws-cdk/core')
import { RestApiStack } from './stacks/rest-api'
import { Aws } from '@aws-cdk/core'

const app = new cdk.App()

new RestApiStack(app, 'rest-api-stack', {
    stackName: `${app.node.tryGetContext('stage')}-cdk-rest-api`,
    env: {
        account: Aws.ACCOUNT_ID,
        region: app.node.tryGetContext('region')
    }
})
