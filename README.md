# api-gateway
Node.js API Gateway. Designed to be simple and scalable. Aims to solve the log storage and analysis problem in an opionated way, to make everyone happy.

This is a smarter-than-usual reverse-proxy which applies rate limits, auth policies, logs all requests&replies to long term storage for later analysis, and finally routes them to API services, which now don't need to implement rate-limiting, logging because it is handled by api-gateway. APIs are defined via API definitions file (see /gateway/src/config.js).

The project is designed for maximum hardware efficiency, and wicked fast analytics queries, thus [Clickhouse](https://github.com/ClickHouse/ClickHouse) is used instead of Elastic or Mongo (which are great projects, but are not as good for OLAP as [column-oriented databases](https://en.wikipedia.org/wiki/Column-oriented_DBMS)).
Clickhouse is very effective in terms of performance of analytical queries, uses best-in-class compression, and has SQL support out of the box. 

Read more about Clickhouse in my blog post from 2018:
https://pixeljets.com/blog/clickhouse-as-a-replacement-for-elk-big-query-and-timescaledb/

Clickhouse became much stronger since then.


# Implementation details
This repo contains 3 apps:

## 1. Gateway Server
Connect.js middleware + [http-proxy](https://github.com/http-party/node-http-proxy) as a reverse proxy.

Attached logger logs all requests/responses going through gateway to APIs for easy debug and monitoring, to Clickhouse server.


## 2. Dashboard Frontend
All logs and graphs are rendered here.

Implemented on the base of https://github.com/wobsoriano/v-dashboard which uses Vite, wonderful [esbuild](https://github.com/evanw/esbuild) which makes frontend development bearable again, Vue 3 and Tailwind. 

## 3. Dashboard Backend
Express.js + Passport authentication.

Clickhouse client which performs read-only SQL queries for log analysis.


All API definitions are stored in code now.

# Work In Progress!
This is more of a concept now.
