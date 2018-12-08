const fs = require('fs');
const _ = require('lodash');

const firstJson = require("../first_crawler_bill.json");
const secondJson = require("../second_crawler_bill.json");
const thirdJson = require("../third_crawler_bill.json");

const JSONFiles = [firstJson, secondJson, thirdJson];

const bills = _.map(JSONFiles, 'bills');
// console.log()
// const firstBills = _.map(bills, bill => bill[0])
// console.log("firstBill", bills[0]);
let allBills = [];
_.forEach(bills, bill => {
    for(let key in bill) {
        allBills.push(bill[key])
    }
});

allBills = _.uniq(allBills, 'name');
// console.log("allBills 0", allBills)
const allBillsJSON = JSON.stringify(allBills);

fs.writeFile(`./server/allBills.json`, allBillsJSON, (err) => {
    if(err) {
        console.error(`something went wrong`, err)
    } else {
        console.log(`wrote file ./server/allBills.json`)
    }
})
