const { ClickHouse } = require('clickhouse')

function assertType(val, type, name) {
    if (typeof val != 'object') {
      if (typeof val != type.name.replace(/^./, function(f){return f.toLowerCase();}))
        throw new Error("`" + val + "` is not of the data type `" + type.name + "`. Property:" + name);
    }
    else if (!(val instanceof type)) {
        throw new Error("`" + val + "` is not of the data type `" + type.name + "`. Property:" + name);
    }
}

class ClickHouseLogger {

	constructor(opts = {}) {
        this.newEntries = []

        this.opts = Object.assign({
           
        }, opts)
        

        this.client = new ClickHouse(this.opts);

        
    }
    async initDb() {
        // avoid using database for db creation
        let optsWithoutDb = Object.assign({}, this.opts)

        let database = optsWithoutDb.database
        delete optsWithoutDb.database
        

        let tempClient = new ClickHouse(optsWithoutDb)

        const queries = [
            `DROP DATABASE IF EXISTS ${database}` ,
            `CREATE DATABASE ${database}`,
            //`USE ${database}`
        ];

        for(const query of queries) {
            console.log('Executing:', query)
            await tempClient.query(query).toPromise()
        }

        this.client = new ClickHouse(this.opts)

    }

    query(query) {
        return this.client.query(query)
    }

    insert(query, data) {
        return this.client.insert(query, data)
    }

    destroyDb() {
        let database = this.opts.database
        return this.client.query(`DROP DATABASE IF EXISTS ${database}`).toPromise()
    }

    async initTables() {
        
        const queries = [
            'DROP TABLE IF EXISTS logs',
        
            `CREATE TABLE logs (
                id String,
                started_at DateTime,
                duration Int32,
                url String,
                target_host String,
                connecting_ip String,
                connecting_country String,
                response_headers String,
                response_body String,
                response_status Int16,
                response_status_message String

            )
            ENGINE=MergeTree( ) ORDER BY (started_at)`
        
        ];
        
        for(const query of queries) {
            const r = await this.client.query(query).toPromise();
        
            //console.log(query, r);
        }
    }

    addEntry(entry) {
        this.newEntries.push(new LogEntry(entry))
        if (typeof this.flushTimer !== 'undefined') {
            clearTimeout(this.flushTimer)
        }
        this.flushTimer = setTimeout(this.flush.bind(this), 10000)
        console.log('append to log:', entry)
    }

    async flush() {
        
        /*let values = this.newEntries.map((i) => {
            return i.id + ',' + i.start_time + ',' + i.duration + ',' + i.url + ',' + i.host + ',' + i.response_body
        })*/

        if (!this.newEntries.length) {
            console.log('no flush, queue empty!')
            return
        }

        //console.log('flushing...', this.newEntries)
        //try {
            await this.client.insert('INSERT INTO logs (id, started_at, duration, url, target_host, connecting_ip, connecting_country, response_headers, response_body, response_status, response_status_message)', this.newEntries).toPromise()
            //await this.client.query('optimize table logs').toPromise()

        //} catch (err) {
        //    console.error(err)
        //}
        clearTimeout(this.flushTimer)
        //console.log('flushed to ch:', this.newEntries)
        this.newEntries = []

        
        // write to clickhouse
    }

}


class LogEntry {
    constructor(data = {}) {
        assertType(data.id, String, 'id')
        assertType(data.url, String, 'url')
        assertType(data.response_body, String, 'response_body')
        assertType(data.response_headers, Object, 'response_headers')
        assertType(data.target_host, String, 'target_host')
        assertType(data.connecting_ip, String, 'connecting_ip')
        //assertType(data.connecting_country, String, 'connecting_country')
        assertType(data.duration, Number, 'duration')
        this.id = data.id
        this.url = data.url
        this.started_at = data.started_at
        this.duration = data.duration
        this.target_host = data.target_host
        this.connecting_ip = data.connecting_ip
        this.connecting_country = data.connecting_country

        this.response_headers = JSON.stringify(data.response_headers)
        this.response_body = data.response_body
        this.response_status = data.response_status
        this.response_status_message = data.response_status_message
    }
}


module.exports = {
    ClickHouseLogger,
    LogEntry
};
