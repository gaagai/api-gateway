# api-gateway
Node.js API Gateway. Designed to be simple and scalable. Aims to solve the log storage and analysis problem in an opionated way, to make everyone happy.

This is a simple&fast reverse-proxy on the base of https://github.com/http-party/node-http-proxy which logs all requests&replies to long term storage for later analysis, and routes them to proper API services, which are defined via API definitions file.

Designed for maximum hardware efficiency, and wicked fast analytics queries, thus Clickhouse is used instead of Elastic or Mongo.
Clickhouse is very effective in terms of performance of analytical queries, uses best-in-class compression, and has SQL support out of the box.
https://pixeljets.com/blog/clickhouse-as-a-replacement-for-elk-big-query-and-timescaledb/


# Work In Progress!
This is more of a concept now.
