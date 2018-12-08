import { Router } from 'express';
import * as BillController from '../controllers/post.controller';
const router = new Router();

// Get all Bills
router.route('/bills').get(BillController.getbills);

// // Get one post by number
// router.route('/bills/:number').get(BillController.getPost);

// // Add a new Post
// router.route('/bills').post(BillController.addPost);

// // Delete a post by number
// router.route('/bills/:number').delete(BillController.deletePost);

export default router;