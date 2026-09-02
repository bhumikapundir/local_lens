// Standard API response formatter: structures successful and failure responses into a
// consistent JSON envelope containing statusCode, data, message, and success flags.
class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }