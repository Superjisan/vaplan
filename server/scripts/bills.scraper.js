const osmosis = require('osmosis');
const _ = require('lodash');
const fs = require('fs');


const scrapeEverything = () => {

    const websiteUrl = `http://lis.virginia.gov/cgi-bin/`;
    const session2019Url = `legp604.exe?191+lst+ALL`;
    const session2019Url2 = `legp604.exe?191+lst+ALL+HJ0578`;
    const session2019Url3 = `legp604.exe?191+lst+ALL+SJ0257`;
    const bills = {}
    let nextLink = ``

    const urlsToAddScrape = [session2019Url, session2019Url2, session2019Url3];

    _.forEach(urlsToAddScrape, (url, index) => {
        osmosis
            .get(`${websiteUrl}${url}`)
            .set(
                {
                    names: ['ul.linkSect:first-of-type li'],
                    numbers: ['ul.linkSect:first-of-type li a'],
                    billLinks: ['ul.linkSect:first-of-type li a@href'],
                    link: '#mainC ul.linkSect:last-of-type a@href'
                }
            )
            .find('ul.linkSect:first-of-type li a')
            .follow('@href')
            .set({
                fullName: 'h3.topLine',
                history: ['#mainC h4:last-of-type + ul.linkSect li'],
                sponsor: 'p:contains("Introduced by:") a:first-child',
                summary: 'h4:contains("SUMMARY") + p'
            })
            .data((bill) => {

                if (!_.isEmpty(bill.history)) {
                    // check if subcommittee is there to check
                    const historyItems = _.map(bill.history, historyString => {
                        const historyItem = {
                            text: historyString
                        };
                        historyItem.date = historyString.split(" ")[0];

                        if (historyString.indexOf("Referred to Committee") !== -1) {
                            bill.committeeText = historyString
                        }
                        if (historyString.indexOf("Assigned") !== -1 && historyString.indexOf("Subcommittee") !== -1) {
                            bill.subcommitteeText = historyString
                        }
                        return historyItem
                    })
                    if (!_.isEmpty(bills)) {
                        const foundBill = _.find(bills, dataBill => {
                            return bill.fullName.replace(/\s+/, "") === dataBill.name.replace(/\s+/, "")
                        })
                        if (foundBill) {
                            foundBill.history = historyItems;
                            if (bill.committeeText) {
                                foundBill.committeeText = bill.committeeText;
                            }
                            if (bill.subcommitteeText) {
                                foundBill.subcommitteeText = bill.subcommitteeText
                            }
                            if (bill.sponsor) {
                                foundBill.sponsor = bill.sponsor;
                            }

                            if (bill.summary) {
                                foundBill.summary = bill.summary;
                            }
                        }
                    }
                }
                if (bill.link) {
                    nextLink = bill.link;
                }

                if (bill.numbers) {
                    if (Object.keys(bills).length < bill.numbers.length) {
                        bill.numbers.forEach((number, index) => {
                            bills[number] = {
                                number,
                                name: bill.names[index],
                                link: bill.billLinks[index]
                            }
                        })
                    }
                }

            })
            .error(console.log)
            .done(() => {
                const dataToSave = {
                    bills,
                    nextLink
                }
                const JSONToSave = JSON.stringify(dataToSave);
                const fileName = `${index}_crawler_bill.json`;
                fs.writeFile(`./server/${fileName}`, JSONToSave, (err) => {
                    if (err) {
                        console.error(`something went wrong`, err)
                    } else {
                        console.log(`wrote file ${fileName}`)
                    }
                })

            })
    })
}

const scrapeBillsListPageDoneCB = (allBills, websiteUrl) => (err, data) => {
    if (err) {
        console.error("scraping bill error", err)
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
                scrapeBillsListPageDoneCB(allBills, websiteUrl)
            )
        } else {
            console.log("all scraping done, bills scraped:", allBills.length);
            allBills = _.uniqBy(allBills, 'number');
            console.log("allBills uniq", allBills.length)
            if (_.isEmpty(allBills)) {
                console.log("empty bills")
            } else {
                const JSONToSave = JSON.stringify(allBills);
                fileName = "newScraper.json"
                fs.writeFile(`./server/${fileName}`, JSONToSave, (err) => {
                    if (err) {
                        console.error(`something went wrong`, err)
                    } else {
                        console.log(`wrote file ${fileName}`)
                    }
                })
            }
        }
    }
}

const scrapeBillsListPage = (url, doneCb) => {
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
        .find('ul.linkSect:first-of-type li a')
        .follow('@href')
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
                if (!_.isEmpty(bills)) {
                    const foundBill = _.find(bills, dataBill => {
                        return data.fullName.replace(/\s+/, "") === dataBill.name.replace(/\s+/, "")
                    })
                    if (foundBill) {
                        foundBill.history = historyItems;
                        if (data.committeeText) {
                            foundBill.committeeText = data.committeeText;
                        }
                        if (data.subcommitteeText) {
                            foundBill.subcommitteeText = data.subcommitteeText
                        }
                        if (data.sponsor) {
                            foundBill.sponsor = data.sponsor;
                        }

                        if (data.summary) {
                            foundBill.summary = data.summary;
                        }
                    }
                }
            }

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
        .done(data => {
            console.log("bills", Object.keys(bills).length);
            const dataToSave = {
                bills,
                nextLink
            }
            doneCb(null, dataToSave);
        })
}

const websiteUrl = `http://lis.virginia.gov`;
const session2019Url = `/cgi-bin/legp604.exe?191+lst+ALL`;
let allBills = [];
// scrapeBillsListPage(
//     `${websiteUrl}${session2019Url}`,
//     scrapeBillsListPageDoneCB(allBills, websiteUrl)
// );

// scrapeEverything();
