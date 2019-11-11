export const responseHandler = (code: number, data: object) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    }

    switch (code) {
        case 200:
        case 201:
            return {
                statusCode: code,
                headers,
                body: JSON.stringify(Object.assign({
                    code
                }, data))
            }
        case 400:
        case 500:
            return {
                statusCode: code,
                headers,
                body: JSON.stringify({
                    error: Object.assign({
                        code
                    }, data)
                })
            }
        default:
            return {
                statusCode: code,
                headers,
                body: JSON.stringify({
                    code
                })
            }
    }
}