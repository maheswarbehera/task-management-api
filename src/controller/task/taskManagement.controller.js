import {ApiErrorResponse, ApiSuccessResponse, asyncHandler} from "node-js-api-response";
import sharedModels from "../../model/index.js";
import { sendMailNotification } from "../../utils/email.js";
const {Task, User} = sharedModels
const createTask = asyncHandler(async(req, res, next) => {
    const {title, description, dueDate, priority, status, assigneeTo} = req.body;

    if(!(title || description || dueDate || priority || status || assigneeTo)) return ApiErrorResponse(401, "All fiels are required", next)

    const task = await Task.create({
        title,
        description,
        dueDate,
        priority,
        status,
        creator: req.user,
        assigneeTo
    })

    if(!task) return ApiErrorResponse(500, "Task creation failed", next)
    const assign = await User.findById({_id: assigneeTo})

    const email = await sendMailNotification.taskAssignee(assign.email, assign.username, task); 
    
    return ApiSuccessResponse(res, 201, {task, email: email.messageId}, "Task created successfully")
})

const getById = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    if (!id) return ApiErrorResponse(422, "Task ID is required", next);
    const task = await Task.findById(id).populate([
        { path: "creator", select: "username" },
        { path: "assigneeTo", select: "username" }
    ])

    if(!task) return ApiErrorResponse(404, "Task not found", next);
    return ApiSuccessResponse(res, 200, task, "Task fetched successfully");
})

const getAll = asyncHandler(async(req, res, next) => {
    const tasks = await Task.find().populate([
        { path: "creator", select: "username" },
        { path: "assigneeTo", select: "username" }
      ]);
    if(tasks.length === 0) return ApiErrorResponse(404, "No task found", next);
    return ApiSuccessResponse(res, 200, {tasks}, "All task fetched successfully"); 
})

const taskUpdate = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    if (!id) return ApiErrorResponse(422, "Task ID is required", next);

    const {title, description, dueDate, priority, status, assigneeTo} = req.body;
    if(!(title || description || dueDate || priority || status || assigneeTo)) return ApiErrorResponse(401, "All fiels are required", next)

    const task = await Task.findByIdAndUpdate(
        { _id: id },
        {
            $set: {
                title,
                description,
                dueDate,
                priority,
                status,
                assigneeTo
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

const taskCreatedByUser = asyncHandler(async(req, res, next) => {
     
    const user = await Task.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'creator',
                foreignField: '_id',
                as: 'creator'
            },
        },
        {
            $unwind: '$creator'
        },
        {
            $match: {
                'creator.username': req.user.username
            }
        }
    ])
    if(!user) return ApiErrorResponse(404, "No task found", next);

    return ApiSuccessResponse(res, 200, user, "success")
})


const taskAssigneeToUser = asyncHandler(async(req, res, next) => {
    
    const user = await Task.aggregate([
        {
            $lookup:{
                from: 'users',
                localField: 'assigneeTo',
                foreignField: '_id',
                as: 'assigneeTo'
            }
        },
        {
            $unwind: '$assigneeTo'
        },
        {
            $match: {
                'assigneeTo.username' : req.user.username
            }
        }
    ])
    if(!user) return ApiErrorResponse(404, "No task found", next);

    return ApiSuccessResponse(res, 200, user, "success")
})

const overDueTask = asyncHandler(async(req, res, next) => {
    const now = new Date();
    const tasks = await Task.find({
      dueDate: { $gt: now },
       
    });
    return ApiSuccessResponse(res, 200, {tasks}, "success")
})

export const taskController = {
    createTask,
    getById,
    getAll,
    taskUpdate,
    deleteTask,
    taskCreatedByUser,
    taskAssigneeToUser,
    overDueTask
}