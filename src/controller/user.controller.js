import { ApiErrorResponse, ApiSuccessResponse, asyncHandler } from "node-js-api-response";
import sharedModels from "../model/index.js";

const {User} = sharedModels

const registerUser = asyncHandler( async(req, res, next) => {
    const {username,email, password} = req.body;
    if(!(username && password && email)) return ApiErrorResponse(422, "All fields are required", next);

    const existUser = await User.findOne({
        $or:[
            {username: username.toLowerCase()},
            {email: email.toLowerCase()}
        ]
    })
    if(existUser) return ApiErrorResponse( 409, "Username or email already exists", next);
    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password
    })

    if(!user) return ApiErrorResponse(500, "User registration failed", next); 
    ApiSuccessResponse(res, 201, user, "user created successfully");
})

const loginUser = asyncHandler(async(req, res, next) => {
    const {username, password} = req.body
    if(!(username && password)) return ApiErrorResponse( 422, "Username and password are required", next);

    const user = await User.findOne({username: username.toLowerCase()});
    if(!user) return ApiErrorResponse(404, "User does not exist.", next);

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) return ApiErrorResponse(401, "Invalid password", next);

    const loggedInUser = await User.findById(user._id).select("-password")
    const accessToken = user.generateAccessToken();
    res.header("Authorization", `Bearer ${accessToken}`);
    
    return ApiSuccessResponse(res, 200,{user: loggedInUser, accessToken}, "User Login Successfull");
})

const getAllUser = asyncHandler(async(req, res, next) => {
    const users = await User.find()
    if(users.length === 0) return ApiErrorResponse(404, "No user Found", next)
    return ApiSuccessResponse(res, 200, {users}, "user fetched successfull!")
})


export const userController = {
    registerUser,
    loginUser,
    getAllUser
}