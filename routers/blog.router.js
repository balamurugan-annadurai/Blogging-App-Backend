import express from "express";
import { createBlog, deleteBlog, getBlogById, getBlogs, updateBlog } from "../controllers/blog.controller.js";
import authmiddleware from "../middleware/authmiddleware.js";


const router = express.Router();

router.get("/", authmiddleware(), getBlogs);
router.get('/:id', authmiddleware(), getBlogById);
router.post("/", authmiddleware(), createBlog);
router.put("/:id", authmiddleware(), updateBlog);
router.delete('/:id', authmiddleware(), deleteBlog);



export default router;