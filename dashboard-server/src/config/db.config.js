module.exports = {
  MYSQL: {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "123456",
    DB: "testdb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  CLICKHOUSE: {
    url: "http://api-gateway_devcontainer_clickhouse_1",
    port: 8123,
    debug: false,
    database: "prod"
  }
  
};
