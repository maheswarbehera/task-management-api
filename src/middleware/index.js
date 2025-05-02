import verifyJwtToken from "./auth.middleware.js";
import globalErrorHandler from "./error.middleware.js";

const sharedMiddlewares = {
    verifyJwtToken,
    globalErrorHandler
}

export default sharedMiddlewares