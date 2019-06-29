const express = require('express');
const app = express();
const path = require('path');
const puzzle = require('./puzzle.json');
const User = require('./models/user.js');
const mysql = require('mysql2/promise');
const asyncHandler = require('express-async-handler');

const port = 4040;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

const io = require('socket.io').listen(server);

const index = require('./routes/index.js');

let foundWords = [];
let panagrams = puzzle.today.pangrams;
let foundPangrams = 0;
let users = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', index);
    
io.on('connection', asyncHandler(async(socket) => {
  socket.on('guess', asyncHandler(async(data) => {

    console.log(`${data.userName} just guessed: ${data.guess}`);

    let guess = data.guess;
    let userName = data.userName;
    let isPanagram = false;

    // get user from database, save if null
    let user = await getUser(userName);
    if (user == undefined) {
      user = await saveUser(userName);
    } 
    
    for (let word of puzzle.today.answers) {
      guess = guess.toLowerCase();
      if (guess.toLowerCase() == word) {
        if (foundWords.indexOf(guess) == -1) {
          if (panagrams.indexOf(guess) != -1) {
            socket.emit('panagramFound', 'You got the panagram!');
            foundPangrams++;
            isPanagram = true;
          } 
          if (!isPanagram || (isPanagram && foundPangrams == users.length)) {
            foundWords.push(guess);
            foundWords.sort();
            io.emit('wordFound', {foundWords, guess});
          }
          break;
        } else {
          io.emit('alreadyFound', guess);
        }  
      }
    }
  }));
}));

async function getUser(userName) {
  const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
  const [rows, fields] = await connection.execute(`SELECT * FROM user WHERE user.Name = ?`, [userName]);
  return(rows[0]);
}

async function saveUser(userName) {
  const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
  const [rows, fields] = await connection.execute(`INSERT INTO user (name) VALUES (?)`, [userName]);
  return getUser(rows.insertId);
}