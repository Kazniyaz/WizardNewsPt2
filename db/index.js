const pg = require('pg');
const postgresUrl = 'postgres://localhost/wnews';
const client = new pg.Client(postgresUrl);

client.connect();

module.exports = client;
