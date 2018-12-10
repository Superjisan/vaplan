const fs = require('fs');
const _  = require('lodash');
const allBills = require("../allBills.json");


const allBillsNoDuplicates = _.uniqBy(allBills, 'number');
const noDuplicateJSON = JSON.stringify(allBillsNoDuplicates);

const fileName = `./server/allBills.json`

fs.writeFile(fileName, noDuplicateJSON, (err) => {
    if(err) {
        console.error(`something went wrong in`, err);
    } else {
        console.log(`wrote file ${fileName}`)
    }
})