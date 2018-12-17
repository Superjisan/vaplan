import osmosis from 'osmosis';
import _ from "lodash";

import { Bill, History } from '../models/bill';

export const scrapeSingleBillPage = (url, doneCb) => {
    console.log("scraping url: ", url);
    const bill = {};
    osmosis
        .get(url)
        .set({
            fullName: 'h3.topLine',
            history: ['#mainC h4:last-of-type + ul.linkSect li'],
            sponsor: 'p:contains("Introduced by:") a:first-child',
            summary: 'h4:contains("SUMMARY") + p'
        })
        .data(data => {
            if (!_.isEmpty(data.history)) {
                // check if subcommittee is there to check
                const historyItems = _.map(data.history, historyString => {
                    const historyItem = {
                        text: historyString
                    };
                    historyItem.date = historyString.split(" ")[0];

                    if (historyString.indexOf("Referred to Committee") !== -1) {
                        data.committeeText = historyString
                    }
                    if (historyString.indexOf("Assigned") !== -1 && historyString.indexOf("Subcommittee") !== -1) {
                        data.subcommitteeText = historyString
                    }
                    return historyItem
                })

                bill.history = historyItems;
            }
            if (data.committeeText) {
                bill.committeeText = data.committeeText;
            }
            if (data.subcommitteeText) {
                bill.subcommitteeText = data.subcommitteeText
            }
            if (data.sponsor) {
                bill.sponsor = data.sponsor;
            }

            if (data.summary) {
                bill.summary = data.summary;
            }
        })
        .error(err => doneCb(err))
        .done(() => {
            console.log("bill scraped finished", bill);
            doneCb(null, { bill })
        })
}

export const populateNewBills = (newBills, websiteUrl) => {
    _.forEach(newBills, bill => {
        scrapeSingleBillPage(`${websiteUrl}${bill.link}`, (err, data) => {
            if (err) {
                console.error(`scraping for bill ${bill.number} failed`)
            } else {
                const updatedBill = data.bill;
                // conditions to update the bill in database
                const ifUpdatedSummary = (!bill.summary && updatedBill.summary) || bill.summary !== updatedBill.summary;
                const ifUpdatedCommitteeText = (!bill.committeeText && updatedBill.committeeText) || bill.committeeText !== updatedBill.committeeText;
                const ifUpdatedSubCommitteeText = (!bill.subcommitteeText && updatedBill.subcommitteeText) || bill.subcommitteeText !== updatedBill.subcommitteeText;
                const ifUpdatedSponsor = (!bill.sponsor && updatedBill.sponsor) || bill.sponsor !== updatedBill.sponsor;

                if (_.get(updatedBill, 'history.length')) {
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
                                    console.log(`updated bill ${newBill.number}`)
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
                            console.log(`updated bill ${newBill.number}`)
                        })
                } else {
                    console.log(`nothing to update for bill ${bill.number}`)
                }
            }
        })
    })
}

export const scrapeBillsListPageDoneCB = (allBills, websiteUrl, res) => (err, data) => {
    if (err) {
        res.status(500).send(err);
    } else {
        console.log("scrape done")
        const extractedBills = data.bills;
        for (let key in extractedBills) {
            allBills.push(extractedBills[key])
        }
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
                res.status(500).send({ message: "scrape failed, Try Again!" });
            } else {
                Bill.find().exec((err, bills) => {
                    if (err) {
                        res.status(500).send(err)
                    } else {
                        // check length of bills
                        if (allBills.length === bills.length) {
                            res.status(200).send({ message: "nothing to update" })
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
                                    res.json({ bills: newBills })
                                    populateNewBills(newBills, websiteUrl);
                                }
                            })
                        } else if (allBills.length < bills.length) {
                            console.log("allBills are more than bills length")
                            const billsToAdd = _.differenceBy(allBills, bills, 'number');
                            if (!billsToAdd.length) {
                                res.status(200).send({ message: "nothing to update" })
                            } else {
                                console.log("need to add new bills ", billsToAdd.length);
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
                                        res.json({ bills: newBills })
                                        populateNewBills(newBills, websiteUrl);
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



export const scrapeBillsListPage = (url, doneCb) => {
    const bills = {};
    let nextLink = '';
    console.log("url", url);
    osmosis
        .get(url)
        .set(
            {
                names: ['ul.linkSect:first-of-type li'],
                numbers: ['ul.linkSect:first-of-type li a'],
                billLinks: ['ul.linkSect:first-of-type li a@href'],
                nextlink: '#mainC ul.linkSect:last-of-type a:contains("More...")@href'
            }
        )
        .data(data => {

            if (data.nextlink) {
                nextLink = data.nextlink;
            }

            if (data.numbers) {
                if (Object.keys(bills).length < 80) {
                    data.numbers.forEach((number, index) => {
                        bills[number] = {
                            number,
                            name: data.names[index],
                            link: data.billLinks[index]
                        }
                    })
                }
            }

        })
        .error(err => {
            doneCb(err);
        })
        .done(() => {
            console.log("bills", Object.keys(bills).length);
            const dataToSave = {
                bills,
                nextLink
            }
            doneCb(null, dataToSave);
        })
}

