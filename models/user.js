const sql = require('mssql');

class User {

  constructor(name) {
    this.name = name;
  }

  save() {
    (async () => {
      console.log('username: ' + this.name);
      try {
          const result = await new sql
            .Request()
            .input('name', this.name)
            .query(
              `INSERT INTO [User] 
                (Name)
              VALUES 
                (@name)
            `);
          console.dir(result);
      } catch (err) {
          console.log('catching errors ' + err);
      }
    })();
  }

}

module.exports = User;