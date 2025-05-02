import mongoose from "mongoose";  
import os from 'os';


const connectDb = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${process.env.DB_NAME}`);
        if(connectionInstance.connection.host == 'localhost'){
            console.log(`[${os.hostname}] MongoDB connected local server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`);
        }else{
            console.log(`[${os.hostname}] MongoDB connected atlas server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`); 
        } 

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB Disconnected! Reconnecting...");
            connectDb(); // Auto-reconnect
        });
        mongoose.connection.on("error", (err) => {
            console.log(`MongoDB Error: ${err.message}`);
        });
    } catch (error) {
        console.log(`[${os.hostname}] MONGODB connection FAILED ${error.name}`);
        process.exit(1);
        
    }
}

export default connectDb;