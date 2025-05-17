import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {

    const connection = await mongoose.connect(process.env.mongoDbConnectionString);
    console.log("DB connected");
    return connection;
}

export default connectDB;