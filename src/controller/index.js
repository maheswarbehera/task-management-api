import { taskController } from "./task/taskManagement.controller.js";
import { userController } from "./user.controller.js";

const sharedControllers ={
    userController,
    taskController
}

export default sharedControllers;