require('dotenv').config();
require('./googleStrategy');
require('./db/index');
const express = require('express');
const passport = require('passport');
const http = require('http');
const socketio = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRouter = require('./routes/auth.router');
const apiRouter = require('./routes/api.router');
const dbRouter = require('./routes/db.router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || '8080';
const distPath = path.join(__dirname, '../client/dist');
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'dog',
  resave: 'false',
  keys: ['key1', 'key2'],
  maxAge: 3600000,
}));
io.on('connection', (socket) => {
  socket.on('sent', () => {
    io.emit('recived');
  });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(distPath));
app.use('/', authRouter);
app.use('/', dbRouter);
app.use(apiRouter);
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
server.listen(PORT, () => console.error(`http://localhost:${PORT}`));
