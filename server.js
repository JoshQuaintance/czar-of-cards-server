const whites = require('./cards/cah-white-cards.json');
const blacks = require('./cards/cah-black-cards.json');
const metadata = require('./cards/cah-metadata-cards.json');

const { Server } = require('socket.io');
const Room = require('./Room');

const io = new Server({
    cors: {
        origin: '*',
    },
});

io.on('connection', socket => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));

    socket.on('create-new-room', data => {
        let room = new Room(data);

        io.emit('new-room-response', 'Room Created');
    });
});


io.listen(3030);
console.log('Socket Up! Listening on port 3030');
