import { Router } from 'express';
import * as BillController from '../controllers/bill.controller';
const router = new Router();

// Get all Bills
router.route('/bills').get(BillController.getBills);

// // Get one post by number
// router.route('/bills/:number').get(BillController.getPost);

// // Add a new Post
router.route('/bills/:number').put(BillController.updateBill);

// // Delete a post by number
// router.route('/bills/:number').delete(BillController.deletePost);

export default router;