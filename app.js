const express = require('express');
const app = express();
const path = require('path');

const port = 4040;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
})

const io = require('socket.io').listen(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { title: 'group b' });
})

io.on('connection', (socket) => {
  socket.on('chatter', function(message) {
    console.log('message : ' + message);
  });
  socket.on('test', (data) => {
    console.log(data)
  });
  socket.emit('sendToClient', 'hello, client');
});