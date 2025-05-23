import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import streamifier from 'streamifier';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if(!localFilePath)
//             return null;
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         });
//         // console.log("File uploaded on cloudinary successfully", response.url);
//         fs.unlinkSync(localFilePath);
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath);
//         return null;
//     }
// }

const uploadOnCloudinary = async (fileBuffer) => {
    try {
        if (!fileBuffer) return null;

        return new Promise((resolve, reject) => {
            // Create a readable stream from the buffer
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' }, // Cloudinary automatically detects the file type (image, video, etc.)
                (error, result) => {
                    if (error) {
                        reject(new Error('Cloudinary upload failed'));
                    }
                    resolve(result); // Resolve the promise with the result from Cloudinary
                }
            );

            // Convert the buffer into a readable stream and pipe it to Cloudinary
            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return null;
    }
};

const getPublicIdFromUrl = (url) => {
    try {
        const regex = /\/v[0-9]+\/(.*)\..+/;
        const match = url.match(regex);
        if (match && match[1]) {
            // console.log(match[1])
            return match[1]; // The public_id is captured in match[1]
        }
        return null; // If no public_id is found
    } catch (error) {
        console.error("Error extracting public_id from URL:", error);
        return null;
    }
}


const deleteFromCloudinary = async (fileURL, resourceType = 'image') => {
    const publicId = getPublicIdFromUrl(fileURL);
    try {
        if (!publicId) {
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        if (response.result === "ok") {
            console.log("File deleted successfully from Cloudinary");
            return true;
        } else {
            console.log("Error deleting file from Cloudinary");
            console.log(response);
            return false;
        }
    } catch (error) {
        console.error("Error deleting file from Cloudinary", error);
        return false;
    }
}

export {
    uploadOnCloudinary,
    getPublicIdFromUrl,
    deleteFromCloudinary
};