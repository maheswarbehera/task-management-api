import mongoose from "mongoose";  
import os from 'os';
import sharedMiddlewares from "../middleware/index.js";

const {sysLogger} = sharedMiddlewares
const connectDb = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${process.env.DB_NAME}`);
        if(connectionInstance.connection.host == 'localhost'){
            sysLogger.info(`[${os.hostname}] MongoDB connected local server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`);
        }else{
            sysLogger.info(`[${os.hostname}] MongoDB connected atlas server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`); 
        } 

        mongoose.connection.on("disconnected", () => {
            sysLogger.warn("MongoDB Disconnected! Reconnecting...");
            connectDb(); // Auto-reconnect
        });
        mongoose.connection.on("error", (err) => {
            sysLogger.error(`MongoDB Error: ${err.message}`);
        });
    } catch (error) {
        sysLogger.error(`[${os.hostname}] MONGODB connection FAILED ${error.name}`);
        process.exit(1);
        
    }
}

export default connectDb;