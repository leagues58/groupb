const mysql = require('mysql2')

const state = {
  pool: null,
}

exports.connect = function(done) {
  state.pool = mysql.createPool({
    host: 'localhost',
    user: 'spellingbeeuser',
    password: 'groupbee',
    database: 'GroupBee'
  });
  done();
}

exports.get = function() {
  return state.pool;
}