#!/usr/bin/env node
import 'source-map-support/register'
import cdk = require('@aws-cdk/core')
import { RestApiStack } from './stacks/rest-api'

const app = new cdk.App()
new RestApiStack(app, 'rest-api-stack', {
    stackName: `${app.node.tryGetContext('stage')}-cdk-rest-api`,
    env: {
        region: app.node.tryGetContext('region')
    }
})
