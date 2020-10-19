const http = require('http'),
    colors = require('colors'),
    connect = require('connect'),
    app = connect(),
    httpProxy = require('http-proxy');

const { ClickHouseLogger } = require('./clickhouse.js')
const { nanoid } = require('nanoid')

const logger = new ClickHouseLogger({url: 'http://clickhouse1', port: 8123, debug: true, database: 'prod'});

const BODY_MAX_LENGTH = 1000;


(async () => {
    //await logger.initDb()
    //await logger.initTables()
})();

        

const proxy = httpProxy.createProxyServer({
    secure: false,
    changeOrigin: true,
    hostRewrite: true
})

proxy.on('proxyRes', function (proxyRes, req, res) {
    req.apg.perfEnd = Date.now()
    req.apg.perfDuration = req.apg.perfEnd - req.apg.perfStart


    var body = [];
    proxyRes.on('data', function (chunk) {
        body.push(chunk);
    });
    proxyRes.on('end', function () {
        body = Buffer.concat(body).toString();
        let connectingIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        logger.addEntry({
            id: req.apg.id,
            url: req.url,
            started_at: req.apg.perfStart,
            duration: req.apg.perfDuration,
            response_status: proxyRes.statusCode,
            response_status_message: proxyRes.statusMessage,
            response_body: body.substr(0, BODY_MAX_LENGTH),
            response_headers: proxyRes.headers,
            connecting_ip: connectingIp,
            target_host: req.apg.targetHost
        })

    });

});




app.use(function (req, res) {

    req.apg = {}
    req.apg.id = nanoid()
    req.apg.perfStart = Date.now()

    let targetHost = 'https://pixeljets.com/'

    req.apg.targetHost = targetHost
    //req.apg.artificalDelay = Math.random() * 100
    proxy.web(req, res, { target: targetHost })

    /*setTimeout(() => {
        proxy.web(req, res, { target: 'http://localhost:9000' })
    }, req.apg.artificalDelay)*/
    
});

http.createServer(app).listen(8000);

//
// Create your target server
//
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/json' });
  res.write('request successfully proxied! Ruby' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);


/*[`exit`, `SIGINT`].forEach((eventType) => {
    console.log(`${eventType} received. Dumping logger data.`);
    process.on(eventType, () => { logger.flush() });
  })*/

/*
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Dumping logger data.');
    logger.flush()
});*/


console.log('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8000'.yellow);
console.log('http server '.blue + 'started '.green.bold + 'on port '.blue + '9000 '.yellow);