const osmosis = require('osmosis');
const _ = require('lodash');

const session2018URL = `http://lis.virginia.gov/cgi-bin/legp604.exe?191+lst+ALL`;
const bills = {}

osmosis
    .get(session2018URL)
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
        history: ['#mainC h4:last-of-type + ul.linkSect li']
    })
    .data((bill) => {
        // do something with listing data
        // console.log("bill", bill.history);
        if (!_.isEmpty(bill.history)) {
            // console.log("bill history", bill.history, bill.fullName);
            if (!_.isEmpty(bills)) {
                // console.log("bill key 1", bills[Object.keys(bills)[0]])
                const foundBill = _.find(bills, dataBill => {
                    // console.log("dataBill", dataBill);
                    return bill.fullName.replace(/\s+/, "") === dataBill.name.replace(/\s+/, "")
                })
                if (foundBill) {
                    foundBill.history = bill.history;
                    // console.log("foundBill", foundBill);
                }
            }
        }
        if (bill.numbers) {
            // console.log("names", bill.names)
            if (Object.keys(bills).length < bill.numbers.length) {
                // console.log("putting in data")
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
        console.log('bills', Object.keys(bills).length, _.map(bills, 'history'));
    })
