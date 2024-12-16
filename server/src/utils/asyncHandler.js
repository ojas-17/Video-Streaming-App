import { ApiError } from "./ApiError.js"

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            console.error('\x1b[31m%s\x1b[0m', err);
            return res
                .status(err?.statusCode || 500)
                .json({
                    statusCode: err?.statusCode, 
                    message: err?.message
                })
        })
    }
}

export {asyncHandler}