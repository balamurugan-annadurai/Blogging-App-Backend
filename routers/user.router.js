import express from "express";
import { login, signup, verifyUser } from "../controllers/user.controller.js";
import authmiddleware from "../middleware/authmiddleware.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", authmiddleware(), verifyUser);




export default router;
