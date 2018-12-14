import _ from 'lodash';

import { scrapeBillsListPage } from '../util/scrapers';
import { Bill } from '../models/bill';

const setRegExFilter = (filter, fields, query) => {
    fields.forEach(field => {
        if (query[field]) filter[field] = new RegExp(query[field], 'i')
    });
    return filter
}

const scrapeBillsListPageDoneCB = (allBills, websiteUrl, res) => (err, data) => {
    if (err) {
        res.status(500).send(err);
    } else {
        console.log("scrape done")
        const extractedBills = data.bills;
        // _.forEach(extractedBills, bill => {
        for (let key in extractedBills) {
            allBills.push(extractedBills[key])
        }
        // });
        if (data.nextLink) {
            console.log("scraping next link", data.nextLink)
            scrapeBillsListPage(
                `${websiteUrl}${data.nextLink}`,
                scrapeBillsListPageDoneCB(allBills, websiteUrl, res)
            )
        } else {

            console.log("all scraping done, bills scraped:", allBills.length, allBills[0]);
            allBills = _.uniqBy(allBills, 'number');
            console.log("allBills uniq", allBills.length)
            if (_.isEmpty(allBills)) {
                res.status(500).send("scrape failed try again");
            } else {
                Bill.find().exec((err, bills) => {
                    if (err) {
                        res.status(500).send(err)
                    } else {
                        // check length of bills
                        if (allBills.length === bills.length) {
                            res.status(200).send("nothing to update")
                        } else if (allBills.length > bills.length) {
                            console.log("creating new bills")
                            const billsToAdd = _.differenceBy(allBills, bills, 'number');
                            console.log(`adding ${billsToAdd.length} bills`)
                            const billsArr = _.map(billsToAdd, bill => {
                                const { number, name, link } = bill;
                                return {
                                    number,
                                    name,
                                    link,
                                    isFavorite: false
                                }
                            });
                            Bill.create(billsArr, (err, newBills) => {
                                if (err) {
                                    console.error('something went wrong with bill creation', err)
                                    res.status(500).send(err)
                                } else {
                                    console.log("all new bills created");
                                    res.json({ newBills })
                                }
                            })
                        } else if (allBills.length < bills.length) {
                            console.log("allBills are more than bills length")
                            const billsToAdd = _.differenceBy(allBills, bills, 'number');
                            if (!billsToAdd.length) {
                                res.status(200).send("nothing to update")
                            } else {
                                console.log("need to add new bills ", billsToAdd.length);
                                Bill.create(billsArr, (err, newBills) => {
                                    if (err) {
                                        console.error('something went wrong with bill creation', err)
                                        res.status(500).send(err)
                                    } else {
                                        console.log("all new bills created");
                                        res.json({ newBills })
                                    }
                                })
                            }
                        }
                    }
                })
            }


        }
    }
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

export function checkForNewBills(req, res) {
    const websiteUrl = `http://lis.virginia.gov`;
    const session2019Url = `/cgi-bin/legp604.exe?191+lst+ALL`;
    let allBills = [];
    scrapeBillsListPage(
        `${websiteUrl}${session2019Url}`,
        scrapeBillsListPageDoneCB(allBills, websiteUrl, res)
    );
}
