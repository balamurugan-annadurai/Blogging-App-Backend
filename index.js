import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./database/dbConfig.js";
import userRoutes from "./routers/user.router.js"
import blogRoutes from "./routers/blog.router.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use("/auth", userRoutes);
app.use("/blogs", blogRoutes);


connectDB();


app.listen(process.env.PORT, () => {
    console.log("App is listening on PORT", process.env.PORT);
})