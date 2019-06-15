const sql = require('mssql');
class Puzzle {

  constructor(data) {
    this.id = data.id;
    this.dateCreated = data.dateCreated;
    this.nytPuzzleId = data.nytPuzzleId;  
    this.solved = data.solved;
    this.answers = data.answers;
  }

  async getTodays() {
    const request = new sql.Request();
    const result = await request.query(`
        SELECT 
            * 
        FROM Puzzle 
        INNER JOIN Answer 
            ON Answer.PuzzleId = Puzzle.Id
        WHERE
            CONVERT (date, Puzzle.DateCreated) = CONVERT (date, GETDATE())
        ORDER BY 
            Puzzle.DateCreated DESC
    `);

    if(result.recordset.length != 0) {
      const puzzle = new Puzzle()
    }
  }

  save(puzzle) {                          
    /**/
    return true;
  }
}

module.exports = Puzzle;