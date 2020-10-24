const { ClickHouseLogger } = require('./clickhouse.js')
const assert = require('assert').strict;

assert.ok(process.env.CLICKHOUSE_URL, 'CLICKHOUSE_URL env var required!')
assert.ok(process.env.CLICKHOUSE_DATABASE, 'CLICKHOUSE_DATABASE env var required!')


const logger = new ClickHouseLogger({url: process.env.CLICKHOUSE_URL, port: process.env.CLICKHOUSE_PORT || 8123, debug: process.env.CLICKHOUSE_DEBUG || false, database: process.env.CLICKHOUSE_DATABASE});
(async () => {
    await logger.initDb()
    await logger.initTables()
})();
