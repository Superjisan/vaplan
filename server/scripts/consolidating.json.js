const fs = require('fs');
const _ = require('lodash');

const firstJson = "../../server/0_crawler_bill.json";
const secondJson = "../../server/1_crawler_bill.json";
const thirdJson = "../../server/2_crawler_bill.json";

const JSONFiles = [require(firstJson), require(secondJson), require(thirdJson)];

const bills = _.map(JSONFiles, 'bills');
let allBills = [];
_.forEach(bills, bill => {
    for(let key in bill) {
        allBills.push(bill[key])
    }
});

allBills = _.uniq(allBills, 'name');
const allBillsJSON = JSON.stringify(allBills);

fs.writeFile(`../../server/allBills.json`, allBillsJSON, (err) => {
    if(err) {
        console.error(`something went wrong`, err)
    } else {
        console.log(`wrote file ./server/allBills.json`)
        
        [firstJson, secondJson, thirdJson].forEach(filePath => {
            fs.unlink(filePath, err => {
                if(err) {
                   console.error(`could not delete file ${filePath}`, err) 
                } else {
                    console.log(`deleted ${filePath}`)
                }
            })
        })
    }
})
