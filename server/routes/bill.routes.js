import { Router } from 'express';
import * as BillController from '../controllers/bill.controller';
const router = new Router();

// Get all Bills
router.route('/bills').get(BillController.getBills);

// check for new bills
router.route('/check-new-bills').post(BillController.checkForNewBills);

// Update a bill
router.route('/bills/:number').put(BillController.updateBill);

// // Delete a post by number
// router.route('/bills/:number').delete(BillController.deletePost);

export default router;