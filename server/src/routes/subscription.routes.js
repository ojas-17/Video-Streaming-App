import { Router } from "express";
import {
    getSubscritions,
    toggleSubscription
} from '../controllers/subscription.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router();

router.route('/:channelId').post(verifyJWT, toggleSubscription);
router.route('/').get(verifyJWT, getSubscritions);

export default router;