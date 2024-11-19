import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'
import fs from 'fs';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log(req.cookies);

        const jsonData = JSON.stringify(req.cookies, null, 2);
        fs.writeFile('../output.json', jsonData, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('Object logged to output.json');
            }
        });
    
        if(!token) {
            throw new ApiError(401, "Unauthorized Request");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }

});
