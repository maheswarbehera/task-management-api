import connectDb from "./db/index.js";
import app from "./app.js";   
import os from 'os';
import dotenv from 'dotenv';

dotenv.config({path: `./.env`});

connectDb()
.then(() => {
    const server = app.listen( process.env.PORT, process.env.HOST, () => {
        console.log(`[${os.hostname}] Server is running on http://${process.env.HOST}:${process.env.PORT}${process.env.BASE_URL}${process.env.API_VERSION}`);
    })

    const gracefulShutdown = (signal) => {
        console.log(`[${os.hostname}] ${signal} Received, server shutting down gracefully...`);
        server.close(() => {
            console.log(`[${os.hostname}] Closed out remaining connections`);
            process.exit(0);
        });
    }

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
})
.catch((error) => {
    console.error(" Database connection failed:",error);
    process.exit(1);
})

// Global error handling for unexpected failures
process.on("unhandledRejection", (error) => {
    console.error(`Unhandled Rejection: ${error.message}`);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    console.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});
