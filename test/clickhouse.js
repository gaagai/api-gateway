'use strict';

const stream = require('stream');
const expect = require('expect.js');
const _  = require('lodash');
const https = require('https');
const fs = require('fs');

const { ClickHouseLogger, LogEntry } = require('../src/clickhouse.js');

const database = 'test_' + _.random(1000, 100000);

const config = {
    url: 'http://clickhouse1',
    port: 8123,
    debug: false,
    database
}

const logger = new ClickHouseLogger(config);


before(async () => {
	//try {
        await logger.initDb()
        await logger.initTables()
    //}  catch (err) {
    //    console.error(err)
    //}
	
});

after(async () => {
    
    await logger.destroyDb()
    
});


describe('Clickhouse logger basic functionality' + database, () => {
    
	it('should return not null object', async () => {


        logger.addEntry({
            started_at: Date.now()-5,
            duration: 34,
            target_host: '127.0.0.1',
            connecting_ip: '192.122.0.2',
            connecting_country: 'US',
            id: 'dwe',
            url: 'http://some-random-url',
            response_body: 'some output',
            response_headers: { 'Content-Type': 'application/json', 'Random-Header': 'value'},
            response_status: 200,
            response_status_message: 'OK'
        })

        logger.addEntry({
            started_at: Date.now(),
            duration: 74,
            target_host: '127.0.0.2',
            connecting_ip: '192.122.0.4',
            connecting_country: 'BR',
            id: 'dwe2',
            url: 'http://some-random-ur2l',
            response_body: 'some other output',
            response_headers: {},
            response_status: 403,
            response_status_message: 'Unathorized access'
        })

        logger.addEntry({
            started_at: Date.now(),
            duration: 102,
            target_host: '127.0.0.3',
            connecting_ip: '193.122.0.4',
            connecting_country: null,
            id: 'dwe3',
            url: 'http://some-random-url3',
            response_headers: {},
            response_body: '{ge: "some other output"}',
            response_status_message: 'Unathorized access'
        })

        var rows = await logger.query("SELECT COUNT(*) as count FROM logs").toPromise()

        // before flush, not records should be found in DB.
        expect(rows[0].count).to.be(0)
        expect(logger.newEntries.length).to.be(3)

        
        await logger.flush()

        expect(logger.newEntries.length).to.be(0)

        rows = await logger.query("SELECT COUNT(*) as count FROM logs").toPromise()
        expect(rows[0].count).to.be(3);

        rows = await logger.query("SELECT * FROM logs WHERE id='dwe2'").toPromise()
        expect(rows[0].response_status).to.be(403)
        expect(rows[0].connecting_ip).to.be('192.122.0.4')
        expect(rows[0].connecting_ip).to.be('192.122.0.4')


        rows = await logger.query("SELECT * FROM logs WHERE id='dwe3'").toPromise()
        expect(rows[0].connecting_country).to.be.empty()
        expect(rows[0].response_status_message).to.be('Unathorized access')
        expect(rows[0].target_host).to.be('127.0.0.3')

        return true
    })
})