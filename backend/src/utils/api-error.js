class ApiError extends Error {
    constructor(statusCode = 500, message = "Something went wrong", error = [], stack) {
        super(message);
        this.statusCode = statusCode;
        this.error = Array.isArray(error) ? error : [error];

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            error: this.error,
        };
    }
}

export { ApiError };