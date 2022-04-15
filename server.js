const { Server } = require('socket.io');

const io = new Server({
    cors: {
        origin: '*',
    },
});

io.on('connection', socket => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

io.listen(3030);
console.log('listening on 3030');
