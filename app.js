const express = require('express');
const app = express();
const path = require('path');
const sql = require('mssql');

const port = 4040;

const config = {
  user: 'SA',
  password: '<YourStrong!Passw0rd>',
  server: 'localhost',
  database: 'SpellingBee'
};

sql.connect(config).catch(err => console.log(err));

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
})

const io = require('socket.io').listen(server);
const index = require('./routes/index.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', index);

io.on('connection', (socket) => {
  socket.on('chatter', function(message) {
    console.log('message : ' + message);
  });
  socket.on('test', (data) => {
    console.log(data)
  });
  socket.emit('sendToClient', 'hello, client');
});