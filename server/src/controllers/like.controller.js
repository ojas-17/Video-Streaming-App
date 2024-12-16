import mongoose from "mongoose";
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {Like} from '../models/like.model.js';
import {Comment} from '../models/comment.model.js';
import {Video} from '../models/video.model.js';

const toggleLike = asyncHandler(async (req, res) => {
    // console.log("------------------------------------------");
    const {videoId, commentId, tweetId} = req.query;
    if(!videoId && !commentId && !tweetId) {
        throw new ApiError(400, "Either Video Id, Comment Id or Tweet Id is required");
    }

    const likeData = {
        likedBy: req.user._id.toString()
    }

    if(videoId) {
        const video = await Video.findById(videoId);
        if(!video) {
            throw new ApiError(404, "Video not Found");
        }

        likeData.video = videoId;
    }
    else if(commentId) {
        const comment = await Comment.findById(commentId);
        if(!comment) {
            throw new ApiError(404, "Comment not Found");
        }

        likeData.comment = commentId;
    }
    // else if(tweetId) {
    //     const tweet = await Tweet.findById(tweetId);
    //     if(!tweet) {
    //         throw new ApiError(404, "Tweet not Found");
    //     }

    //     likeData.tweet = tweetId;
    // }

    // console.log(likeData);
    const existingLike = await Like.find(likeData);
    // console.log(existingLike);
    let statusCode;
    let like;
    let msg;
    if(existingLike?.length) {
        // console.log(existingLike[0]._id);
        like = await Like.deleteOne({_id: existingLike[0]._id});
        // console.log(like);
        if(!like) {
            throw new ApiError(500, "Something went wrong while deleting like");
        }
        msg = "Like deleted successfully";
        statusCode = 204
    } else{
        like = await Like.create(likeData);
        // console.log(like);
        if(!like) {
            throw new ApiError(500, "Something went wrong while creating like");
        }

        msg = "Like posted successfully";
        statusCode = 201
    }
    
    return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, like, msg));
});

const getLikes = asyncHandler(async (req, res) => {
    const {videoId, commentId, tweetId} = req.query;
    if(!videoId && !commentId && !tweetId) {
        throw new ApiError(400, "Either Video Id, Comment Id or Tweet Id is required");
    }

    const userId = req.query?.userId;
    // console.log(userId)

    const page = req.query?.page || 1;
    const limit = req.query?.page || 10;
    const skip = (page-1) * limit;
    const sortBy = "createdAt";
    const sortType = -1;

    const likeData = {};

    if(videoId) {
        const video = await Video.findById(videoId);
        if(!video) {
            throw new ApiError(404, "Video not Found");
        }

        likeData.video = new mongoose.Types.ObjectId(videoId);
    }
    else if(commentId) {
        const comment = await Comment.findById(commentId);
        if(!comment) {
            throw new ApiError(404, "Comment not Found");
        }

        likeData.comment = new mongoose.Types.ObjectId(commentId);
    }
    // else if(tweetId) {
    //     const tweet = await Tweet.findById(tweetId);
    //     if(!tweet) {
    //         throw new ApiError(404, "Tweet not Found");
    //     }

    //     likeData.tweet = new mongoose.Types.ObjectId(tweetId);
    // }

    // const likes = await Like.find(likeData);
    // console.log(likeData);
    const likes = await Like.aggregate([
        {
            $match: likeData
        },
        {
            $lookup: {
                from: "users",
                localField: "likedBy",
                foreignField: "_id",
                as: "likedBy",
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
                likedBy: {
                    $first: "$likedBy"
                },
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
    ]);
    if(!likes) {
        throw new ApiError(500, "Something went wrong while fetching likes");
    }

    const totalLikes = await Like.countDocuments(likeData)
    const totalPages = Math.ceil(totalLikes / limit);

    likeData.likedBy = userId;
    let isLiked = await Like.findOne(likeData);
    // console.log(likeData);
    isLiked = isLiked ? true : false;
    // console.log(isLiked);
    
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            isLiked,
            likes,
            totalLikes,
            totalPages,
            currentPage: page

        },
        "Likes fetched successfully"
    ));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const skip = (page-1) * limit;

    const videos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
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
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            views: 1,
                            createdAt: 1,
                            owner: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);
    if(!videos) {
        throw new ApiError(500, "Something went wrong while fetching liked videos");
    }

    const totalVideos = await Like.countDocuments({
        likedBy: new mongoose.Types.ObjectId(req?.user?._id),
        video: {$exists: true}
    })
    const totalPages = Math.ceil(totalVideos / limit);

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            videos,
            totalVideos,
            totalPages,
            currentPage: page
        },
        "Liked videos fetched successfully"
    ));
});

export {
    toggleLike,
    getLikes,
    getLikedVideos
}