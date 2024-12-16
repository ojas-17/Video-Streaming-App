import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath)
            return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // console.log("File uploaded on cloudinary successfully", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const getPublicIdFromUrl = (url) => {
    try {
        const regex = /\/v[0-9]+\/(.*)\..+/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1]; // The public_id is captured in match[1]
        }
        return null; // If no public_id is found
    } catch (error) {
        console.error("Error extracting public_id from URL:", error);
        return null;
    }
}


const deleteFromCloudinary = async (fileURL) => {
    const publicId = getPublicIdFromUrl(fileURL);
    try {
        if (!publicId) {
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId);
        if (response.result === "ok") {
            console.log("File deleted successfully from Cloudinary");
            return true;
        } else {
            console.log("Error deleting file from Cloudinary");
            return false;
        }
    } catch (error) {
        console.error("Error deleting file from Cloudinary", error);
        return false;
    }
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
};