import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js'
import {Comment} from '../models/comment.model.js';
import {Video} from '../models/video.model.js';

const postComment = asyncHandler(async (req, res) => {
    const videoId = req.params?.videoId;
    if(!videoId) {
        throw new ApiError(400, "Video Id is required");
    }
    
    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiError(404, "Video not found");
    }

    const {content} = req.body;
    if(!content) {
        throw new ApiError(400, "Comment cannot be empty");
    }

    // console.log({
    //     video: video._id,
    //     content,
    //     owner: req.user._id
    // });
    const comment = await Comment.create({
        video: video._id,
        content,
        owner: req.user._id
    });

    const uploadedComment = await Comment.findById(comment._id);
    if(!uploadedComment) {
        throw new ApiError(500, "Something went wrong while uploading comment");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, uploadedComment, "Comment uploaded successfully"));
});

const getComments = asyncHandler(async (req, res) => {
    const videoId = req.params?.videoId;
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page-1) * limit;
    const sortBy = req.query?.sortBy || "createdAt";
    const sortType = req.query?.sortType === "asc" ? 1 : -1;

    if(!videoId) {
        throw new ApiError(400, "Video Id is required");
    }
    
    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiError(404, "Video not found");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                video: video._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $sort: {
                [sortBy]: sortType
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
        // {
        //     $project: {
        //         content: 1,
        //         owner: 1,
        //         createdAt: 1
        //     }
        // }
    ]);
    if(!comments) {
        throw new ApiError(404, "No comment found");
    }

    const totalComments = await Comment.countDocuments({
        video: video._id
    });
    const totalPages = Math.ceil(totalComments / limit);

    return res
    .status(200)
    .json(new ApiResponse(200, {
        comments,
        totalComments,
        totalPages,
        currentPage: page
    }, "Comments fetched successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const commentId = req.params?.commentId;
    if(!commentId) {
        throw new ApiError(400, "Comment Id is required");
    }

    const comment = await Comment.findById(commentId);
    if(!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if(comment.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(401, "Only owner can modify comment");
    }

    const {content} = req.body;
    if(!content) {
        throw new ApiError(400, "Comment content is required");
    }

    comment.content = content;
    await comment.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params?.commentId;
    if(!commentId) {
        throw new ApiError(400, "Comment Id is required");
    }

    const comment = await Comment.findById(commentId);
    if(!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if(comment.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(401, "Only owner can delete comment");
    }

    const deletedComment = await Comment.deleteOne({_id: commentId});
    if(!deletedComment) {
        throw new ApiError(500, "Something went wrong while deleting the comment");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {comment, deletedComment}, "Comment updated successfully"));
});

export {
    postComment,
    getComments,
    updateComment,
    deleteComment
}