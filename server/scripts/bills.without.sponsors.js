const osmosis = require('osmosis');
const _ = require("lodash");
const fs = require('fs');
const allBills = require("../allBills.json");

const websiteUrl = `http://lis.virginia.gov`;

const billsWithoutSponsors = _.filter(allBills, bill => !bill.sponsor);
console.log(`there are ${billsWithoutSponsors.length} without sponsors`);
console.log(`Unique Bills Count: ${_.uniqBy(allBills, 'number').length}`)

const fillOutIncompleteData = (billsWithoutSponsors, incompleteJSON, fileName) => {
    const singleDataCallBack = bill => {
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
            // replace the json that you are parsing wtih more complete data
            if (!_.isEmpty(incompleteJSON)) {
                const foundBill = _.find(incompleteJSON, dataBill => {
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
    }
    const doneCallBack = () => {
        const JSONToSave = JSON.stringify(incompleteJSON);
        fs.writeFile(`./server/${fileName}`, JSONToSave, (err) => {
            if (err) {
                console.error(`something went wrong`, err)
            } else {
                console.log(`wrote file ${fileName}`)
            }
        })
    }
    _.forEach(billsWithoutSponsors, bill => {
        osmosis.get(`${websiteUrl}${bill.link}`)
            .set({
                fullName: 'h3.topLine',
                history: ['#mainC h4:last-of-type + ul.linkSect li'],
                sponsor: 'p:contains("Introduced by:") a:first-child',
                summary: 'h4:contains("SUMMARY") + p'
            })
            .data(singleDataCallBack)
            .done(doneCallBack)
    })
}
// UNCOMMENT THIS to run the query
// fillOutIncompleteData(billsWithoutSponsors, allBills, `allBills.json`)





