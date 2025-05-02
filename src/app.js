import express from 'express'
import { ApiSuccessResponse, ApiError,ApiErrorResponse } from 'node-js-api-response';
import path from 'path';
import cors from 'cors'; 
import { fileURLToPath } from 'url';
import sharedRoutes from './route/index.js';
import dotenv from 'dotenv';
import sharedMiddlewares from './middleware/index.js';
import userAgent from "express-useragent"

dotenv.config({path: `./.env`});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(express.json());
app.use(express.static("public"));
app.use(userAgent.express());
app.use(sharedMiddlewares.logRequestResponse);

app.use(cors({ 
    origin: process.env.CORS_ORIGIN, 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

const urlMapping = `/${process.env.BASE_URL}/${process.env.API_VERSION}`;

const appRoutes = [
    { path: "/users", route: sharedRoutes.userRoutes },
    { path: "/tasks", route: sharedRoutes.taskRoutes },
]

appRoutes.forEach(({ path, route }) => {
    app.use(`${urlMapping}${path}`, route);
    console.log(`${urlMapping}${path}`)
}); 

app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "favicon.ico"));
}); 
app.get("/api/v1/",(req, res) => { 
    return ApiSuccessResponse(res, 200, null, `Server running on http://${process.env.HOST}:${process.env.PORT}${urlMapping}`); 
})
app.get('/api/v1/error', (req, res, next) => {
    const error = new ApiError(400,'This is a test error');
    next(error);
});
app.all('*', (req, res, next) => { 
    return ApiErrorResponse(404, `Route not found: ${req.method} ${req.originalUrl}`, next); 
});

app.use(sharedMiddlewares.globalErrorHandler)

export default app