import {Bill} from '../models/bill';


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
      res.json({ bills});
    });
  }

