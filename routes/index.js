var express = require('express');
var router = express.Router();
const path = require('path');
const sql = require('mssql');
var fs = require('fs');

var test;

const fileName = './../puzzle.json';

/* GET home page. */
router.get('/', function(req, res, next) {

    (async function query(){
        // get puzzle from db
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
        `)

        // if no puzzle in db, get from file
        if(result.recordset.length == 0) {
            fs.stat(fileName, function(err, stat) {
                if(err == null) {
                    fs.readFile(fileName, 'utf8', function (err, data) {
                        if (err) throw err;
                        console.log('reading file');
                        let resulttext = JSON.parse(data);
                    });      
                }
            });
        }

        res.render('index', { title: 'groub b', puzzle: result });
    })();
    
  });

  module.exports = router;