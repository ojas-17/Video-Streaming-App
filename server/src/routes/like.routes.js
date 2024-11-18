import { Router } from "express";
import {
    getLikedVideos,
    getLikes,
    toggleLike
} from '../controllers/like.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/").post(verifyJWT, toggleLike);
router.route("/").get(getLikes);
router.route("/liked-videos").get(verifyJWT, getLikedVideos);

export default router;