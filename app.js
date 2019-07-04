const express = require('express');
const app = express();
const path = require('path');
const puzzle = require('./puzzle.json');
const User = require('./models/user.js');
const mysql = require('mysql2/promise');
const asyncHandler = require('express-async-handler');
const cookieParser = require('cookie-parser');

const port = 4040;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

const io = require('socket.io').listen(server);

const index = require('./routes/index.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());

app.use('/', index);
    
io.on('connection', asyncHandler(async(socket) => {
  
  socket.on('foundWord', asyncHandler(async(data) => {
    console.log(socket); 
    console.log('***********************');
  }));

  socket.on('getPuzzle', asyncHandler(async(data) => {
    const puzzle = require('./testpuzzle.json');
    socket.emit('returnPuzzle', { puzzle });
  }));

  socket.on('getRoom', asyncHandler(async(data) => {
    let roomId = await getRoomId(socket.id)
    socket.emit('returnRoom', { roomId });
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

async function getRoomId(socketId) {
  const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
  const [rows, fields] = await connection.execute(`SELECT * FROM room WHERE roomId = ?`, [socketId]);

  if (rows[0] != undefined) {
    return rows[0].roomId;
  }
  
  return insertRoomId(socketId)

}

async function insertRoomId(socketId) {
  const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
  const [rows, fields] = await connection.execute(`INSERT INTO room (roomId) VALUES (?)`, [socketId]);
  return socketId;
}