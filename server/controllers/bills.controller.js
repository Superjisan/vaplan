const osmosis = require('osmosis');
const _ = require('lodash');
const fs = require('fs');

const websiteUrl = `http://lis.virginia.gov/cgi-bin/`;
const session2019Url = `legp604.exe?191+lst+ALL`;
const bills = {}
let nextLink = ``

osmosis
    .get(`${websiteUrl}${session2019Url}`)
    .set(
        {
            names: ['ul.linkSect:first-of-type li'],
            numbers: ['ul.linkSect:first-of-type li a']
        }
    )
    .paginate('ul:nth-of-type(2) li a')
    .find('ul.linkSect:first-of-type li a')
    .follow('@href')
    .set({
        fullName: 'h3.topLine',
        history: ['#mainC h4:last-of-type + ul.linkSect li'],
        link: 'ul:nth-of-type(2) li a[href]'
    })
    .data((bill) => {
        // do something with listing data
        if (!_.isEmpty(bill.history)) {
            // check if subcommittee is there to check
            const historyItems = _.map(bill.history, historyString => {
                const historyItem = {
                    text: historyString
                };
                historyItem.date = historyString.split(" ")[0];

                if(historyString.indexOf("Referred to Committee") !== -1) {
                    bill.committeeText = historyString
                }
                if(historyString.indexOf("Assigned") !== -1 && historyString.indexOf("Subcommittee") !== -1) {
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
                    if(bill.committeeText) {
                        foundBill.committeeText = bill.committeeText;
                    }
                    if(bill.subcommitteeText) {
                        foundBill.subcommitteeText = bill.subcommitteeText
                    }
                }
            }
        }
        if(bill.link) {
            nextLink = bill.link;
        }

        if (bill.numbers) {
            // console.log("names", bill.names)
            if (Object.keys(bills).length < bill.numbers.length) {
                bill.numbers.forEach((number, index) => {
                    bills[number] = {
                        number,
                        name: bill.names[index]
                    }
                })
            }
        }

    })
    // .log(console.log)
    .error(console.log)
    .then((context, result) => {
        // console.log('result', result);
    })
    // .debug(console.log)
    .done(data => {
        const dataToSave = {
            bills,
            nextLink
        }
    
        const JSONToSave = JSON.stringify(dataToSave);
        const fileName = `first_crawler_bill.json`;
        fs.writeFile(`./server/${fileName}`, JSONToSave, (err) => {
            if(err) {
                console.error(`something went wrong`, err)
            } else {
                console.log(`wrote file ${fileName}`)
            }
        })

    })
