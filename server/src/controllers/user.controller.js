import mongoose from "mongoose";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { Video } from '../models/video.model.js';
import { Like } from '../models/like.model.js';
import { Comment } from '../models/comment.model.js';
import { Subscription } from '../models/subscription.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // console.log({accessToken, refreshToken});
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // console.log(req)
    const { username, email, fullName, password } = req.body;
    // console.log(email);

    if (
        [username, email, fullName, password].some((field) => field?.trim === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar?.[0]?.buffer;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.buffer;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path;
    // }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Profile Picture is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "https://res.cloudinary.com/daz3h4k3g/image/upload/v1735216372/jrje1yefiww8fkb0itnq.png"
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );

});

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(req.body);

    if (!email && !username) {
        throw new ApiError(400, "Username or Email is required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect User Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    // console.log({accessToken, refreshToken});

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: false,
        // sameSite: 'lax'
        secure: true,
        sameSite: 'None'
    }

    // console.log({accessToken, refreshToken});
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        // secure: false,
        // sameSite: 'lax'
        secure: true,
        sameSite: 'None'
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));

});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    // console.log(req.cookies);

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        // console.log(user);

        if (incomingRefreshToken !== user?.refreshToken) {
            // console.log(incomingRefreshToken);
            // console.log(user?.refreshToken);
            throw new ApiError(401, "Refresh Token is expired");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        // console.log({accessToken, refreshToken});

        const options = {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            // secure: false,
            // sameSite: 'lax'
            secure: true,
            sameSite: 'None'
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access Token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }

});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordValid = user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Old Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, username } = req.body;
    if (!fullName && !username) {
        throw new ApiError(400, "Atleast one field is required");
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (fullName) {
        user.fullName = fullName;
    }

    if (username) {
        user.username = username;
    }

    await user.save({ validateBeforeSave: false });

    // const user = await User.findByIdAndUpdate(
    //     req.user?._id,
    //     {
    //         $set: {
    //             fullName,
    //             email
    //         }
    //     },
    //     {new: true}
    // ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.buffer;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar?.url) {
        throw new ApiError(500, "Error while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Profile Image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.buffer;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage?.url) {
        throw new ApiError(500, "Error while uploading Cover Image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover Image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [new mongoose.Types.ObjectId(req.query?.userId), "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1
            }
        },
    ]);

    if (!channel?.length) {
        throw new ApiError(404, "Channel does not exist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully")
        );

});

const checkSubscribed = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!userId?.trim()) {
        throw new ApiError(401, "Channel Username is required");
    }
    if (!req?.user?._id) {
        throw new ApiError(401, "User not logged in");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    // console.log(userId);
    // console.log(req?.user?._id);

    const isSubscribed = await Subscription.findOne({
        channel: channel._id,
        subscriber: req?.user?._id
    })

    if (!isSubscribed?.length()) {
        throw new ApiError(404, "Subscription not found");
    }

    // const isSubscribed = await Subscription.aggregate([
    //     {
    //         $addFields: {
    //             isSubscribed: {
    //                 if: {$in: []}
    //             }
    //         }
    //     }
    // ])

    return res
        .status(200)
        .json(new ApiResponse(200, isSubscribed, "Subscription checked successfully"))
});

const getWatchHistory = asyncHandler(async (req, res) => {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $addFields: {
                watchHistory: {
                    $reverseArray: "$watchHistory"
                }
            }
        },
        {
            $unwind: "$watchHistory"
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
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
                                        fullName: 1,
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
                    }
                ]
            }
        },
        {
            $match: {
                "watchHistory.0": { $exists: true, $ne: {} }
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $group: {
                _id: "$_id",
                watchHistory: {
                    $push: {
                        $first: "$watchHistory"
                    }
                }
            }
        }
    ]);
    // console.log(user[0]);
    // console.log(req.user._id);
    const user2 = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $unwind: "$watchHistory"
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $project: {
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            $match: {
                "watchHistory.0": { $exists: true, $ne: {} }
            }
        },
        {
            $group: {
                _id: "$_id",
                watchHistory: {
                    $push: {
                        $first: "$watchHistory"
                    }
                }
            }
        }
    ]);
    // console.log(user2);

    const totalVideos = user2[0]?.watchHistory?.length;
    const totalPages = Math.ceil(totalVideos / limit);


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    watchHistory: user?.[0]?.watchHistory || [],
                    totalVideos: totalVideos || 0,
                    totalPages: totalPages || 0,
                    currentPage: page
                },
                "Watch History fetched successfully"
            )
        );

});

const verifyPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Password");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, isPasswordValid, "Password verified successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const videos = await Video.find({ owner: req.user._id });
    if (!videos) {
        throw new ApiError(404, "No videos found");
    }

    videos.map(async (video) => {
        const likes = await Like.deleteMany({ video: new mongoose.Types.ObjectId(video._id) });
        if (!likes) {
            throw new ApiError(500, "Error while deleting likes of video");
        }

        const comments = await Comment.find({ video: new mongoose.Types.ObjectId(video._id) });
        if (!comments) {
            throw new ApiError(500, "Error while deleting comments of video");
        }

        comments.map(async (comment) => {
            const likes = await Like.deleteMany({ comment: new mongoose.Types.ObjectId(comment._id) });
            if (!likes) {
                throw new ApiError(500, "Error while deleting likes of comment of video");
            }

            const deletedComment = await Comment.findByIdAndDelete(comment._id);
            if (!deletedComment) {
                throw new ApiError(500, "Error while deleting comment of video");
            }
        });

        const deletedVideo = await Video.findByIdAndDelete(video._id);
        if(!deletedVideo) {
            throw new ApiError(500, "Error while deleting video");
        }
    });


    const likes = await Like.find({ LikedBy: req.user._id });
    if (!likes) {
        throw new ApiError(500, "Error while deleting likes");
    }

    likes.map(async (like) => {
        const deletedLike = await Like.findByIdAndDelete(like._id);
        if (!deletedLike) {
            throw new ApiError(500, "Error while deleting like");
        }
    });


    const comments = await Comment.find({ owner: req.user._id });
    if(!comments) {
        throw new ApiError(500, "Error while deleting comments");
    }

    comments.map(async (comment) => {
        const deletedComment = await Comment.findByIdAndDelete(comment._id);
        if (!deletedComment) {
            throw new ApiError(500, "Error while deleting comment");
        }
    });


    const deletedSubscriptions = await Subscription.deleteMany({
        $or: [
            { subscriber: req.user._id },
            { channel: req.user._id }
        ]
    });
    if(!deletedSubscriptions) {
        throw new ApiError(500, "Error while deleting subscriptions");
    }

    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if(!deletedUser) {
        throw new ApiError(500, "Error while deleting user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleteUser, "User deleted successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    checkSubscribed,
    getWatchHistory,
    verifyPassword,
    deleteUser
};