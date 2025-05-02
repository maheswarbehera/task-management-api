import {ApiErrorResponse, ApiSuccessResponse, asyncHandler} from "node-js-api-response";
import sharedModels from "../../model/index.js";

const {Task} = sharedModels
const createTask = asyncHandler(async(req, res, next) => {
    const {title, description, dueDate, priority, status} = req.body;

    if(!(title || description || dueDate || priority || status)) return ApiErrorResponse(401, "All fiels are required", next)

    const task = await Task.create({
        title,
        description,
        dueDate,
        priority,
        status
    })

    if(!task) return ApiErrorResponse(500, "Task creation failed", next)
    return ApiSuccessResponse(res, 201, task, "Task created successfully")
})

const getById = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    if (!id) return ApiErrorResponse(422, "Task ID is required", next);
    const task = await Task.findById(id)

    if(!task) return ApiErrorResponse(404, "Task not found", next);
    return ApiSuccessResponse(res, 200, task, "Task fetched successfully");
})

const getAll = asyncHandler(async(req, res, next) => {
    const tasks = await Task.find();
    if(tasks.length === 0) return ApiErrorResponse(404, "No task found", next);
    return ApiSuccessResponse(res, 200, {tasks}, "All task fetched successfully"); 
})

const taskUpdate = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    if (!id) return ApiErrorResponse(422, "Task ID is required", next);

    const {title, description, dueDate, priority, status} = req.body;
    if(!(title || description || dueDate || priority || status)) return ApiErrorResponse(401, "All fiels are required", next)

    const task = await Task.findByIdAndUpdate(
        { _id: id },
        {
            $set: {
                title,
                description,
                dueDate,
                priority,
                status
            },
        },
        {upsert: true, new: true}
    )
    if(!task) return ApiErrorResponse(404, "Task update failed", next);

    return ApiSuccessResponse(res, 200, task, "Task updated successfully")
})


const deleteTask = asyncHandler(async(req,res,next) => {
    const {id} = req.params;
    if (!id) return ApiErrorResponse(422, "Task ID is required", next);
    const task = await Task.findByIdAndDelete(id)

    if(!task) return ApiErrorResponse(404, "Task not found", next)
    return ApiSuccessResponse(res, 200, null, "Task delete successfull")
})


export const taskController = {
    createTask,
    getById,
    getAll,
    taskUpdate,
    deleteTask
}