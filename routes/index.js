const express = require('express');
const router = express.Router();
const path = require('path');
const sql = require('mssql');
const fs = require('fs');

const fileName = './puzzle.json';

/* GET home page. */
router.get('/', function(req, res, next) {
    //const todayPuzzle = getData();
    //console.log(todayPuzzle);
    res.render('index', { title: 'groub b', gameData: '', test: 'hello' });
  });


function getData() {
    let resultText;
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) throw err;
        resultText = JSON.parse(data);
    }).finally(console.log('done reading text file'));
    
    //return resultText.today;
  }

  module.exports = router;