const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
//const db = require('../db.js');
const mysql = require('mysql2/promise');

/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {
  const puzzleId = 1;
  const puzzle = await getPuzzle(puzzleId)
  const foundWords = await getFoundWords();

  res.render('index', { puzzle: puzzle, test: 'hello', foundWords: foundWords });
}));



const getPuzzle = async (puzzleId) => {
  const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
  const [rows, fields] = await connection.execute(`SELECT * FROM puzzle INNER JOIN word ON word.PuzzleId = puzzle.Id WHERE Puzzle.Id = ?`, [puzzleId]);
  const outerLetters = [rows[0].L2, rows[0].L3, rows[0].L4, rows[0].L5, rows[0].L6, rows[0].L7];
  const centerLetter = [rows[0].L1];
  const words = [];
  for (let row of rows) {
    words.push(row.Word);
  }
  return {words, outerLetters, centerLetter};

};

const getFoundWords = (puzzleId) => {
  const foundWords = ['font'];
  return foundWords;
};


module.exports = router;