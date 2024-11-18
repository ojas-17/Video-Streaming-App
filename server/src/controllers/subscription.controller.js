import mongoose from "mongoose";
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    const channel = await User.findById(new mongoose.Types.ObjectId(channelId));
    if(!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const subscription = await Subscription.findOne({
        subscriber: req?.user?._id,
        channel: channel?._id
    })

    let msg = ""
    let statusCode;

    let subscription2;
    if(!subscription) {
        subscription2 = await Subscription.create({
            subscriber: req?.user?._id,
            channel: channel?._id
        })

        // console.log(subscription2);

        if(!subscription2) {
            throw new ApiError(500, "Error creating subscription");
        }

        msg = "Subscription created successfully"
        statusCode = 201
    }
    else {
        subscription2 = await Subscription.deleteOne({
            _id: subscription._id
        })

        // console.log(subscription2);

        if(!subscription2) {
            throw new ApiError(500, "Error deleting subscription");
        }

        msg = "Subscription deleted successfully"
        statusCode = 200
    }

    // console.log(subscription2, msg);

    return res
    .status(200)
    .json(new ApiResponse(statusCode, {subscription: subscription2}, msg));
})

export {
    toggleSubscription
}