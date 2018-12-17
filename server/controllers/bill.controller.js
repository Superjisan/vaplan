import _ from 'lodash';

import {
    scrapeBillsListPage,
    scrapeBillsListPageDoneCB,
    scrapeSingleBillPage
} from '../util/scrapers';
import { Bill, History } from '../models/bill';

const setRegExFilter = (filter, fields, query) => {
    fields.forEach(field => {
        if (query[field]) filter[field] = new RegExp(query[field], 'i')
    });
    return filter
}

/**
 * Get bills based on search
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
        if (req.query.isIncomplete) {
            filter.sponsor = { "$exists": false };
            filter.summary = { "$exists": false };
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
/**
 * Update a bill
 * @param {*} req Express object with params, body
 * @param {*} res Express response
 */
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

/**
 * 
 * 
 */
export function checkForNewBills(req, res) {
    const websiteUrl = `http://lis.virginia.gov`;
    const session2019Url = `/cgi-bin/legp604.exe?191+lst+ALL`;
    let allBills = [];
    scrapeBillsListPage(
        `${websiteUrl}${session2019Url}`,
        scrapeBillsListPageDoneCB(allBills, websiteUrl, res)
    );
}

/**
 * 
 * 
 */
export function updateSingleBill(req, res) {
    const { bill } = req.body;
    const websiteUrl = `http://lis.virginia.gov`;
    scrapeSingleBillPage(`${websiteUrl}${bill.link}`, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            const updatedBill = data.bill;
            // conditions to update the bill in database
            const ifUpdatedSummary = (!bill.summary && updatedBill.summary) || bill.summary !== updatedBill.summary;
            const ifUpdatedCommitteeText = (!bill.committeeText && updatedBill.committeeText) || bill.committeeText !== updatedBill.committeeText;
            const ifUpdatedSubCommitteeText = (!bill.subcommitteeText && updatedBill.subcommitteeText) || bill.subcommitteeText !== updatedBill.subcommitteeText;
            const ifUpdatedSponsor = (!bill.sponsor && updatedBill.sponsor) || bill.sponsor !== updatedBill.sponsor;

            if (_.isEmpty(bill.historyItems) || bill.historyItems.length < _.get(updatedBill, 'history.length')) {
                let historyItemsToCreate = [];
                if (!_.isEmpty(bill.historyItems)) {
                    historyItemsToCreate = _.differenceBy(updatedBill.history)
                } else {
                    historyItemsToCreate = updatedBill.history;
                }
                History.create(historyItemsToCreate, (err, historyItems) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        if (!bill.historyItems) {
                            updatedBill.historyItems = historyItems
                        } else {
                            updatedBill.historyItems = bill.historyItems;
                            _.forEach(historyItems, item => {
                                updatedBill.historyItems.push(item);
                            })
                        }
                        Bill.findOneAndUpdate(
                            { number: bill.number },
                            updatedBill,
                            { new: true },
                            (err, newBill) => {
                                if (err) {
                                    res.status(500).send(err);
                                }
                                res.json({ bill: newBill });
                            })
                    }
                })
            } else if (ifUpdatedCommitteeText || ifUpdatedSponsor || ifUpdatedSummary || ifUpdatedSubCommitteeText) {
                Bill.findOneAndUpdate(
                    { number: bill.number },
                    updatedBill,
                    { new: true },
                    (err, newBill) => {
                        if (err) {
                            res.status(500).send(err);
                        }
                        res.json({ bill: newBill });
                    })
            } else {
                res.status(200).send("nothing to update");
            }
        }
    })
}
