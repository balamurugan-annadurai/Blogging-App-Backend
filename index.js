import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./database/dbConfig.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());



connectDB();


app.listen(process.env.PORT, () => {
    console.log("App is listening on PORT", process.env.PORT);
})