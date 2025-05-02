import jwt from "jsonWebToken";
import { asyncHandler, ApiErrorResponse } from "node-js-api-response";
import sharedModel from "../model/index.js";

const {User} = sharedModel

const verifyJwtToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader)
        return ApiErrorResponse(401, "Authorization header required", next);

    const token = authHeader.split(" ")[1];
    if (!token) return ApiErrorResponse(401, "Access token required", next);

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) return ApiErrorResponse(404, "User not found. Please log in again.", next);

    req.user = user;
    next();
});

export default verifyJwtToken;
