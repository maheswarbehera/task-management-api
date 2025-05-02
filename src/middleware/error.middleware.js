import os from 'os';
import { ApiError } from 'node-js-api-response';
import sharedMiddlewares from './index.js';


const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500; 
    let message =  err.message || 'Something went wrong. Please try again later.'; 
    const status = err.status || false; 
    const stack = err.stack || undefined; 
    const name = err.name || 'Error';
    
    const {errorLogger} = sharedMiddlewares;
    if (process.env.NODE_ENV === 'development') {
        errorLogger.error(`[${os.hostname}] [${statusCode}] | ${req.method} | ${req.originalUrl} - ${name} | ${message} | ${stack}`); 
    }else {
        errorLogger.error(`[${os.hostname}] [${statusCode}] | ${req.method} | ${req.originalUrl} - ${name} | ${message}`); 
    }

    if (err instanceof ApiError) {
        return res.status(statusCode).json({
          status, 
          statusCode,
          message,
          ...(process.env.NODE_ENV === 'development' && { name, stack }),
        });
    }

    if (err.code === 11000) {
        statusCode = 409;
        const duplicateFields = err.keyValue ? Object.entries(err.keyValue).map(([key, value]) => `${key}: ${value}`) : []; 
        return res.status(statusCode).json({
          status,
          statusCode,
          message: `Duplicate entry: ${duplicateFields.join(", ")} already exists.`,       
          ...(process.env.NODE_ENV === 'development' && {name, stack }),
        });
      }
    
      // Mongoose validation error
      if (err.name === "ValidationError") {
        statusCode = 400;
        return res.status(statusCode).json({
          status,
          statusCode,
          message: Object.values(err.errors).map((val) => val.message),
          ...(process.env.NODE_ENV === 'development' && {name, stack }),
        });
      }
      
      // Handle invalid MongoDB ObjectId errors
      if (err.name === "CastError") {
        statusCode = 400
        return res.status(statusCode).json({
          status,
          statusCode,
          message: `Invalid ${err.path}: ${err.value}`, 
          ...(process.env.NODE_ENV === "development" && { name, stack }),
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