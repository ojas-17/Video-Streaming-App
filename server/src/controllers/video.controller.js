import mongoose from "mongoose";
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js'
import {Video} from '../models/video.model.js';
import {User} from '../models/user.model.js';
import {Comment} from '../models/comment.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';

const uploadVideo = asyncHandler(async (req, res) => {
    const {title, description} = req.body;

    const user = await User.findById(req.user?._id);
    if(!user) {
        throw new ApiError(404, "User not found");
    }

    if(!title) {
        throw new ApiError(400, "Title is required");
    }

    if(!description) {
        throw new ApiError(400, "Description is required");
    }
    
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    if(!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if(!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    // console.log(videoFile);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoFile || !thumbnail) {
        throw new ApiError(500, "Something went wrong while uploading to cloudinary");
    }

    const video = await Video.create({
        videoFile: videoFile?.url,
        thumbnail: thumbnail?.url,
        title,
        description,
        duration: videoFile?.duration,
        isPublished: false,
        owner: user._id
    });

    const uploadedVideo = await Video.findById(video._id);

    if(!uploadedVideo) {
        throw new ApiError(500, "Something went wrong while uploading the video");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, uploadedVideo, "Video uploaded successfully")
    )
});

const searchVideo = asyncHandler(async (req, res) => {
    const {videoId, userId} = req.query;
    const title = req.query?.title || "";
    // console.log(req.query);
    // if(!title && !videoId && !userId) {
    //     throw new ApiError(400, "Atleast one query param is required");
    // }

    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page-1) * limit;

    const sortBy = req.query?.sortBy || 'createdAt';
    const sortType = req.query?.sortType === 'asc' ? 1 : -1;

    const searchCriteria = [];
    if(videoId) {
        searchCriteria.push({_id: new mongoose.Types.ObjectId(videoId)});
    }
    else if(userId) {
        searchCriteria.push({owner: new mongoose.Types.ObjectId(userId)});
    }
    else {
        searchCriteria.push({title: new RegExp(title, 'i')});
    }
    // console.log(searchCriteria);

    const videos = await Video.aggregate([
        {
            $match:{
                $or: searchCriteria
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
    ]);
    if(!videos) {
        throw new ApiError(404, "No video found");
    }

    const totalVideos = await Video.countDocuments({
        $or: searchCriteria
    });
    const totalPages = Math.ceil(totalVideos / limit);

    // console.log(videos)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                videos,
                totalVideos,
                totalPages,
                currentPage: page
            },
            "Videos fetched successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const videoId = req.params?.videoId;
    if(!videoId) {
        throw new ApiError(400, "Video Id is required");
    }

    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiError(404, "Video not found");
    }

    // console.log(video.owner.toString());
    // console.log(req.user?._id?.toString());
    if(video.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(401, "Only Owner can modify video");
    }

    const {title, description} = req.body;
    const thumbnailLocalPath = req.file?.path;
    // console.log(req.file.path);
    // console.log(req.body);
    if(!title && !description && !thumbnailLocalPath) {
        throw new ApiError(400, "Either Title, Description or Thumbnail is required");
    }
    
    if(title) {
        video.title = title;
    }
    if(description) {
        video.description = description;
    }
    if(thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        // console.log(thumbnail);
        if(!thumbnail) {
            throw new ApiError(500, "Error while uploading to cloudinary");
        }
        video.thumbnail = thumbnail.url;
    }

    await video.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const videoId = req.params?.videoId;
    if(!videoId) {
        throw new ApiError(400, "Video Id is required");
    }

    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiError(404, "Video not found");
    }

    const comments = await Comment.deleteMany({video: new mongoose.Types.ObjectId(videoId)});
    // console.log(comments);

    const deletedVideo = await Video.deleteOne({_id: videoId});
    if(!deleteVideo) {
        throw new ApiError(500, "Something went wrong while deleting the video");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {video, deletedVideo}, "Video deleted successfully"));
});

export {
    uploadVideo,
    searchVideo,
    updateVideo,
    deleteVideo
}