// Node server which will handle socket io connections
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        //If any new user joins, other users get the information about it
        // console.log("New User", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    socket.on('send', message => {
        //broadcast message to other people
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
});