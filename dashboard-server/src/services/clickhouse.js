const { ClickHouse } = require('clickhouse');
const assert = require('assert').strict;

let _db;


function initDb(config) {
    if (_db) {
        console.warn("Trying to init DB again!");
        return _db;
    }

    _db = new ClickHouse(config);
    return _db;
}

function getDb() {
    assert.ok(_db, "Db has not been initialized. Please called init first.");
    return _db;
}


module.exports = {
    getDb,
    initDb
};