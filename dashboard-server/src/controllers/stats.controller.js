const { getDb } = require('../services/clickhouse');

let ch = getDb();

exports.stats = (req, res) => {
    

    (async () => {
        let r =  await ch.query('SELECT COUNT(*) as count FROM logs').toPromise();
        
        res.send({ data: r[0].count });
    })()
}


exports.statsItems = (req, res) => {
    

    (async () => {
        let r =  await ch.query('SELECT * FROM logs').toPromise();
        
        res.send({ data: r });
    })()
}