import Bill from '../models/bill';



/**
 * Get all bills
 * @param req
 * @param res
 * @returns void
 */
export function getBill(req, res) {
    Post.find().sort('-dateAdded').exec((err, posts) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ posts });
    });
  }

