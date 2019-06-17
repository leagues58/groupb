const express = require('express');
const app = express();
const path = require('path');
const puzzle = require('./puzzle.json');

const port = 4040;

const config = {
  user: 'spellingbeeuser',
  password: 'groupbee',
  server: 'localhost',
  database: 'SpellingBee'
};

//sql.connect(config).catch(err => console.log(err));

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
})

const io = require('socket.io').listen(server);
const index = require('./routes/index.js');
let foundWords = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.io = io;
//app.use('/', index);
app.get('/', function(req, res, next) {

  res.render('index', { title: 'groub bee', gameData: puzzle, test: 'hello', foundWords: foundWords, totalWordsCount: puzzle.today.answers.length });
});

io.on('connection', (socket) => {

  socket.on('guess', (guess) => {
    console.log(`client ${socket.id} just guessed: ${guess}`);  
    for (let word of puzzle.today.answers) {
      if (guess.toLowerCase() == word) {
        if (foundWords.indexOf(guess) == -1) {
          foundWords.push(guess);
          io.emit('answerFound', {answer: guess, foundWordsCount: foundWords.length});
          break;
        }     
      }
    }
  });
});