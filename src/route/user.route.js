import { Router } from "express";
import sharedControllers from "../controller/index.js";
import sharedMiddlewares from "../middleware/index.js"

const router = Router()

const {userController} = sharedControllers
const {verifyJwtToken} = sharedMiddlewares

const routes = [
    {
        method: "post",
        path: "/signup",
        handler: userController.registerUser,
        middlewares: []
    },
    {
        method: "post",
        path: "/login",
        handler: userController.loginUser,
        middlewares: []
    }
]

routes.forEach(({method, path, handler, middlewares}) => {
    router[method](path, ...middlewares, handler);
    // console.warn(`Registered Route: [${method.toUpperCase()}] ${path}`);
})

export default router