const osmosis =  require('osmosis');
const _ = require('lodash');

const session2018URL = `http://lis.virginia.gov/cgi-bin/legp604.exe?191+lst+ALL`;
const bills = []

osmosis
    .get(session2018URL)
    // .find('.linkSect li')
    // .set('name' )
    // // // .follow('@href')
    // .find('.linkSect li a')
    // .set('number')
    .set(
        { 
            names: ['ul.linkSect:first-of-type li'],
            numbers: ['ul.linkSect:first-of-type li a']
        }
    )
    // .find('')
    // .follow('@href')
    .paginate('ul:nth-of-type(2) li a')
    // .find('p > a')
    // .follow('@href')
    // .set({
    //     'title':        'section > h2',
    //     'description':  '#postingbody',
    //     'subcategory':  'div.breadbox > span[4]',
    //     'date':         'time@datetime',
    //     'latitude':     '#map@data-latitude',
    //     'longitude':    '#map@data-longitude',
    //     'images':       ['img@src']
    // })
    // .follow('More...')
    // .paginate('@href')
    .data((bill) => {
        // do something with listing data
        // console.log("bill", bill);
        _.forEach(bill.names, (name, index) => {
            bills.push({name, number: bill.numbers[index]})
        });
        console.log('bills', bills, bills.length);
        
    })
    // .log(console.log)
    .error(console.log)
    .then((context, result) => {
        // console.log('result', result);
    })
    // .debug(console.log)
    .done(data => {
        // console.log('bills', bills);
    })
