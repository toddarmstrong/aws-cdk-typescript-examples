// import uuid = require('uuid/v4')
import { scan } from './dynamodb'
import { responseHandler } from './utils'

const TableName = process.env.MOVIES_TABLE_NAME

module.exports.getAllMovies = async () => {
    try {
        const params = {
            TableName
        }

        return responseHandler(200, {
            data: await scan(params)
        })
    } catch (err) {
        return responseHandler(500, { message: err.message })
    }
}
