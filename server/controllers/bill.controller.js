import { Bill } from '../models/bill';

/**
 * Get all bills
 * @param req
 * @param res
 * @returns void
 */
export function getBills(req, res) {
  let filter = {};
  if (req.query) {
    if(req.query.isFavorite) {
      filter.isFavorite = req.query.isFavorite;
    }
    if(req.query.committeeText) {
      filter.committeeText = new RegExp(req.query.committeeText, 'i') 
    }
    if(req.query.number) {
      filter.number = new RegExp(req.query.number, 'i') 
    }
    if(req.query.name) {
      filter.name = new RegExp(req.query.name, 'i') 
    }
  }
  Bill.find(filter)
    .populate('historyItems')
    .sort('number')
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

