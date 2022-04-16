const whites = require('./cards/cah-white-cards.json');
const blacks = require('./cards/cah-black-cards.json');
const metadata = require('./cards/cah-metadata-cards.json');

const { Server } = require('socket.io');
const { v4: uuid } = require('uuid');
const Room = require('./Room');

const newRoomIO = new Server({
    cors: {
        origin: '*',
    },
});

newRoomIO.on('connection', socket => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));

    socket.on('create-new-room', data => {
        let hostPassword = uuid();
        data.hostPassword = hostPassword;
        let room = new Room(data);

        socket.emit('room-created', { created: true, port: room.port, hostPassword });
    });
});

newRoomIO.listen(3030);

console.log('New Room Creation Socket Up! Listening on port 3030');
