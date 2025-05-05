import {Router} from "express"
import sharedControllers from "../../controller/index.js"
import sharedMiddlewares from "../../middleware/index.js"

const {taskController} = sharedControllers
const {verifyJwtToken} = sharedMiddlewares
const router = Router()

const routes = [
    {
        method: "post",
        path: "/create",
        handler: taskController.createTask,
        middlewares: [verifyJwtToken]
    }, 
    {
        method: "get",
        path: "/id/:id",
        handler: taskController.getById,
        middlewares: [verifyJwtToken]
    }, 
    {
        method: "get",
        path: "/",
        handler: taskController.getAll,
        middlewares: [verifyJwtToken]
    }, 
    {
        method: "put",
        path: "/id/:id",
        handler: taskController.taskUpdate,
        middlewares: [verifyJwtToken]
    }, 
    {
        method: "delete",
        path: "/id/:id",
        handler: taskController.deleteTask,
        middlewares: [verifyJwtToken]
    }, 
    {
        method: "get",
        path: "/dashboard",
        handler: taskController.taskCreatedByUser,
        middlewares: [verifyJwtToken]
    }, 
    {
        method: "get",
        path: "/dashboard/assign",
        handler: taskController.taskAssigneeToUser,
        middlewares: [verifyJwtToken]
    }, 
    {
        method: "get",
        path: "/dashboard/dueTask",
        handler: taskController.overDueTask,
        middlewares: [verifyJwtToken]
    }, 
    {
        method: "get",
        path: "/filter",
        handler: taskController.filterTask,
        middlewares: [verifyJwtToken]
    }, 
    {
        method: "get",
        path: "/search",
        handler: taskController.searchTask,
        middlewares: [verifyJwtToken]
    }, 


]

routes.forEach(({method, path, middlewares, handler}) => {
    router[method](path, ...middlewares, handler);
    // console.warn(`Registered Route: [${method.toUpperCase()}] ${path}`);
})

export default router