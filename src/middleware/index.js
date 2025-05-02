import verifyJwtToken from "./auth.middleware.js";
import globalErrorHandler from "./error.middleware.js";
import sysLogger, { errorLogger, logRequestResponse } from "./logger.js";

const sharedMiddlewares = {
    verifyJwtToken,
    globalErrorHandler,
    sysLogger,
    errorLogger,
    logRequestResponse,
}

export default sharedMiddlewares