import os from 'os';
import { ApiError } from 'node-js-api-response';

const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500; 
    let message =  err.message || 'Something went wrong. Please try again later.'; 
    const status = err.status || false; 
    const stack = err.stack || undefined; 
    const name = err.name || 'Error';

    if (process.env.NODE_ENV === 'development') {
        console.error(`[${os.hostname}] [${statusCode}] | ${req.method} | ${req.originalUrl} - ${name} | ${message} | ${stack}`); 
    }else {
        console.error(`[${os.hostname}] [${statusCode}] | ${req.method} | ${req.originalUrl} - ${name} | ${message}`); 
    }

    if (err instanceof ApiError) {
        return res.status(statusCode).json({
          status, 
          statusCode,
          message,
          ...(process.env.NODE_ENV === 'development' && { name, stack }),
        });
    }


    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        return res.status(statusCode).json({ 
          status, 
          statusCode,
          message: "Access token has expired",  name,
          ...(process.env.NODE_ENV === "development" && { name, stack }),
        });
    } else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        return res.status(statusCode).json({ 
          status,
          statusCode,
          message: "Invalid access token", 
          ...(process.env.NODE_ENV === "development" && { name, stack }),
        });
    }

    res.status(statusCode).json({
        status,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { name, stack }) 
    });
};

export default globalErrorHandler;