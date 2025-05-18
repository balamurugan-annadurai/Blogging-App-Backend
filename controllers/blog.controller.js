import Blog from "../models/blog.schema.js";

export const createBlog = async (req, res) => {
    try {
        const user = req.user;
        const { title, category, content, image } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({ message: "Title, category, and content are required" });
        }

        const newBlog = new Blog({
            title,
            category,
            content,
            image,
            author: user.name,
            userId: user._id,
        });

        const savedBlog = await newBlog.save();

        return res.status(201).json({
            message: "Blog created successfully",
            blog: savedBlog,
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;


        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this blog" });
        }

        const { title, content, category, image } = req.body;

        if (title) blog.title = title;
        if (content) blog.content = content;
        if (category) blog.category = category;
        if (image !== undefined) blog.image = image;

        const updatedBlog = await blog.save();

        return res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Blog update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const userId = req.user._id;
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this blog" });
        }

        await Blog.findByIdAndDelete(blogId);

        return res.status(200).json({ message: "Blog deleted successfully", status: true });
    } catch (error) {
        console.error("Delete blog error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getBlogs = async (req, res) => {
    try {
        const { category, author } = req.query;

        const filter = {};
        if (category) filter.category = category;
        if (author) filter.author = author;

        const blogs = await Blog.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            count: blogs.length,
            blogs,
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({
            status: false,
            message: "Server error while fetching blogs",
        });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            status: true,
            blog,
        });
    } catch (error) {
        console.error("Error fetching blog by ID:", error);
        return res.status(500).json({
            status: false,
            message: "Server error while fetching the blog",
        });
    }
};