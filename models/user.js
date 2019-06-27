const db = require('../db.js')

class User {

  constructor(name) {
    this.name = name;
  }


  static get() {
    console.log('getting user');
    db.get().query(`SELECT * FROM user WHERE name = ?`, this.name, function(err, result) {
      if (err) {
        console.log(err); 
        return;
      }
      console.log(`got user: ${result}`);
    });
  }

  save() {
    db.get().query(`INSERT INTO user (name) VALUES (?)`, this.name, function(err, result) {
      if (err) return;
      console.log(`inserted id: ${result.insertId}`);
    });
  }
}

module.exports = User;