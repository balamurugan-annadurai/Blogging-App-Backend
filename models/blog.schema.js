import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ['Career', 'Finance', 'Travel', 'Health', 'Education', 'Agriculture'],
            required: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: '',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
