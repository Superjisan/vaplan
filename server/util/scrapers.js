import osmosis from 'osmosis';

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
        .done(data => {
            console.log("bills", Object.keys(bills).length);
            const dataToSave = {
                bills,
                nextLink
            }
            doneCb(null, dataToSave);
        })
}