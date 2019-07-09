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
    io.to(data.roomId).emit('wordFound', { userId: data.userId, word: data.word });
    //console.log(socket); 
    console.log('***********************');
  }));

  socket.on('getPuzzle', asyncHandler(async(data) => {
    const puzzle = require('./testpuzzle.json');
    socket.emit('returnPuzzle', { puzzle });
  }));

  socket.on('createUser', asyncHandler(async function (data, callback) {
    const userId = await saveUser(data.name);
    callback({ userId });
  }));

  socket.on('createRoom', asyncHandler(async(data, callback) => {
    const room = await createRoom();
    const roomDetailId = await createRoomDetail(room.roomId, data.userId);
    socket.join(room.roomId);
    callback({ roomId: room.roomId });
  }));
}));

async function getUser(userName) {
  const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
  const [rows, fields] = await connection.execute(`SELECT * FROM user WHERE user.Name = ?`, [userName]);
  return(rows[0]);
}

async function saveUser(userName) {
  console.log('saving user');
  try {
    const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
    const [rows, fields] = await connection.execute(`INSERT INTO user (name) VALUES (?)`, [userName]);
    console.log('saved user');
    return rows.insertId;
  }
  catch(err) {
    console.log('saveUserError: ' + err);
  }
}

async function getRoomId(userId) {
  try {
    const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
    const [rows, fields] = await connection.execute(`SELECT * FROM roomdetail WHERE userId = ?`, [userId]);
  
    if (rows[0] != undefined) {
      return rows[0].roomId;
    }

    return insertRoomId(userId)
  }
  catch(err) {
    console.log('getRoomId: ' + err);
  }
}

async function createRoom(useId) {
  try {
    const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
    const [rows, fields] = await connection.execute(`INSERT INTO room (name) VALUES ('test room')`, []);
    return {roomId: rows.insertId, roomName: 'test room'};
  }
  catch(err) {
    console.log('createRoom error: ' + err)
  }
}

async function createRoomDetail(roomId, userId) {
  try {
    const connection = await mysql.createConnection({host:'localhost', user: 'spellingbeeuser', database: 'GroupBee', password: 'groupbee'});
    const [rows, fields] = await connection.execute(`INSERT INTO roomdetail (roomId, userId) VALUES (?, ?)`, [roomId, userId]);
    return rows.insertId;
  }
  catch(err) {
    console.log('createRoomDetail: ' + err);
  }
}