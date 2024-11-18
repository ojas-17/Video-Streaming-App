import { Router } from "express";
import {
    deleteVideo,
    searchVideo,
    updateVideo,
    uploadVideo
} from '../controllers/video.controller.js';
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/upload").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
);
router.route("/").get(searchVideo);
router.route("/:videoId").patch(verifyJWT, upload.single("thumbnail"), updateVideo);
router.route("/:videoId").delete(verifyJWT, deleteVideo);


export default router;