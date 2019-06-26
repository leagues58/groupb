const express = require('express');
const app = express();
const path = require('path');
const puzzle = require('./puzzle.json');
const User = require('./models/user.js');
const sql = require('mssql');

const port = 4040;

const config = {
  user: 'spellingbeeuser',
  password: 'groupbee',
  server: 'localhost',
  database: 'SpellingBee'
};

sql.connect(config).catch(err => console.log(err));

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
})

const io = require('socket.io').listen(server);
const index = require('./routes/index.js');
let foundWords = [];
let panagrams = puzzle.today.pangrams;
let foundPangrams = 0;
let users = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.io = io;
//app.use('/', index);
app.get('/', function(req, res, next) {

  res.render('index', { title: 'group bee', puzzle: puzzle, test: 'hello', foundWords: foundWords });
});
    
io.on('connection', (socket) => {
  socket.on('guess', (data) => {
    console.log(`${data.userName} just guessed: ${data.guess}`);  
    let guess = data.guess;
    let userName = data.userName;
    let isPanagram = false;

    if (users.indexOf(userName) == -1) {
      users.push(userName);
      let tempUser = new User(userName);
      console.log('new user ' + tempUser.name);
      tempUser.save();
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
            io.emit('answerFound', {foundWords, guess});
          }
          break;
        } else {
          io.emit('alreadyFound', guess);
        }  
      }
    }
  });
});