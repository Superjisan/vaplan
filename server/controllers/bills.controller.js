const osmosis = require('osmosis');
const _ = require('lodash');

const session2018URL = `http://lis.virginia.gov/cgi-bin/legp604.exe?191+lst+ALL`;
const bills = []

osmosis
    .get(session2018URL)
    .set(
        {
            names: ['ul.linkSect:first-of-type li'],
            numbers: ['ul.linkSect:first-of-type li a']
        }
    )
    .paginate('ul:nth-of-type(2) li a')

    .data((bill) => {
        // do something with listing data
        // console.log("bill", bill);
        _.forEach(bill.names, (name, index) => {
            bills.push({ name, number: bill.numbers[index] })
        });
        console.log('bills', bills, bills.length);
    })
    .error(console.log)
    .then((context, result) => {
    })
    .done(data => {
        console.log('bills', bills.length);
    })
