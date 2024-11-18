import { Router } from "express";
import {
    deleteComment,
    getComments,
    postComment,
    updateComment
} from '../controllers/comment.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/:videoId").post(verifyJWT, postComment);
router.route("/:videoId").get(getComments);
router.route("/:commentId").patch(verifyJWT, updateComment);
router.route("/:commentId").delete(verifyJWT, deleteComment);

export default router;