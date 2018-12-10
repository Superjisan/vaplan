import { Bill } from '../models/bill';


/**
 * Get all bills
 * @param req
 * @param res
 * @returns void
 */
export function getBills(req, res) {
  Bill.find()
    .populate('historyItems')
    .exec((err, bills) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ bills });
    });
}

export function updateBill(req, res) {
  const { number } = req.params;
  const { bill } = req.body
  Bill.findOneAndUpdate({ number }, bill, { new: true }, (err, updatedBill) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ bill: updatedBill });
  })
}

