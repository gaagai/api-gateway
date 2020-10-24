const http = require('http'),
    colors = require('colors'),
    connect = require('connect'),
    app = connect(),
    httpProxy = require('http-proxy'),
    vhost = require('vhost'),
    assert = require('assert').strict;

const { ClickHouseLogger } = require('./clickhouse.js')
const { Apis, Users, UsersApisAccess } = require('./config.js')


const { nanoid } = require('nanoid')

assert.ok(process.env.CLICKHOUSE_URL, 'CLICKHOUSE_URL env var required!')
assert.ok(process.env.CLICKHOUSE_DATABASE, 'CLICKHOUSE_DATABASE env var required!')

const logger = new ClickHouseLogger({url: process.env.CLICKHOUSE_URL, port: process.env.CLICKHOUSE_PORT || 8123, debug: process.env.CLICKHOUSE_DEBUG || false, database: process.env.CLICKHOUSE_DATABASE});

const REQUEST_BODY_MAX_LENGTH = 1000;
const RESPONSE_BODY_MAX_LENGTH = 1000;


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
        //console.log('connection:', req.connection);
        let connectingIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

        logger.addEntry({
            id: req.apg.id,
            url: req.url,
            started_at: req.apg.perfStart,
            duration: req.apg.perfDuration,
            response_status: proxyRes.statusCode,
            response_status_message: proxyRes.statusMessage,
            response_body: body.substr(0, RESPONSE_BODY_MAX_LENGTH),
            response_headers: proxyRes.headers,
            connecting_ip: connectingIp,
            target_host: req.apg.targetHost
        })

    });

});

app.use(function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
        if (data.length > REQUEST_BODY_MAX_LENGTH) {
            req.bodyTrimmed = data;
            next();
        }
    });
    req.on('end', function() {
        req.bodyTrimmed = data;
        next();
    });
});



app.use(function (req, res) {

    req.apg = {}
    req.apg.id = nanoid()
    req.apg.perfStart = Date.now()

    let host = req.headers.host
    
    let apiDefinition = Apis.find((d) => d.hostname == host)
    console.log('HOST:', host)
    console.log('API DEF:', apiDefinition)
    if (!apiDefinition) {
        res.writeHead(502, 'No corresponding host found')
        res.end('No corresponding host found')
    }

    if (apiDefinition.useStubServer) {
        var target = 'http://127.0.0.1:8555'
        var headers = { Host: apiDefinition.hostname }
        
    } else {
        var target = 'http://' + apiDefinition.hostname
        var headers = {} 
    }

    console.log('TARGET:', target);
    console.log('TARGET HEADERS:', headers)
    
    req.apg.apiName = apiDefinition.name
    req.apg.targetHost = target
    //req.apg.artificalDelay = Math.random() * 100
    proxy.web(req, res, { target, headers })

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


// Launch test target servers from definitions
let apiStubServer = connect()

Apis.forEach((definition) => {
    let definitionApp = connect()
    
    definitionApp.use(definition.stubServerConfig.handler)
    console.log('api definition '.blue + definition.hostname.green.bold + ' found '.blue);
    apiStubServer.use(vhost(definition.hostname, definitionApp))

})

apiStubServer.use(function(req, res) {
    console.log('INSIDE STUB MASTER SERVER!');
    console.log(req.headers)
    res.writeHead(200)
    res.end('INSIDE STUB MASTER SERVER!');
})

apiStubServer.listen(8555)
console.log('stub api server with '.blue + (Apis.length).toString().blue.bold + ' definitions '.blue + 'started '.green.bold + 'on port '.blue + '8555 '.yellow);


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