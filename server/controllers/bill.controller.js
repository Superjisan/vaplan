import { Bill } from '../models/bill';

const setRegExFilter = (filter, fields, query) => {
    fields.forEach(field => {
        if (query[field]) filter[field] = new RegExp(query[field], 'i')
    });
    return filter
}

/**
 * Get all bills
 * @param req
 * @param res
 * @returns void
 */
export function getBills(req, res) {
    let filter = {};
    if (req.query) {
        if (req.query.isFavorite) {
            filter.isFavorite = req.query.isFavorite;
        }
        const fieldsToSearchOn = ['committeeText', 'number', 'name', 'sponsor', 'summary'];
        filter = setRegExFilter(filter, fieldsToSearchOn, req.query);
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

