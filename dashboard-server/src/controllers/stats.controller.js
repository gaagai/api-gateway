const { getDb } = require('../services/clickhouse');

let ch = getDb();

exports.stats = (req, res) => {
    

    (async () => {
        let r =  await ch.query('SELECT COUNT(*) as count FROM logs').toPromise();

        let rFailed =  await ch.query('SELECT COUNT(*) as count FROM logs WHERE response_status>299').toPromise();
        
        let failRate = rFailed[0].count ? (rFailed / (r * 0.01)) : 0;

        res.send({ data: { num: r[0].count, failed: rFailed[0].count, failRate  } });
    })()
}


exports.statsItems = (req, res) => {
    

    (async () => {
        let r =  await ch.query('SELECT * FROM logs LIMIT 25').toPromise();
        let count = (await ch.query('SELECT COUNT(*) as count FROM logs').toPromise())[0].count;

        res.send({ 
            meta: {
                totalPages: Math.ceil(count / 25)
            },
            data: r 
        });
    })()
}