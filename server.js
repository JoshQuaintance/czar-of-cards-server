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

const roomFinder = new Server({
    cors: {
        origin: '*',
    },
});

newRoomIO.on('connection', socket => {
    console.info('CONN: Client connected to Room Creation socket');
    socket.on('disconnect', () => console.info('CONN: Client disconnected from Room Creation socket'));

    socket.on('create-new-room', data => {
        let hostPassword = uuid();
        data.hostPassword = hostPassword;
        let room = new Room(data);

        socket.emit('room-created', { created: true, port: room.port, hostPassword });
    });
});

newRoomIO.listen(3030);

console.info('SOCK: New Room Creation Socket Up! Listening on port 3030');

roomFinder.on('connection', socket => {
    console.log('CONN: Client connected to Room Finder socket');
    socket.on('disconnect', () => console.info('CONN: Client disconnected from Room Finder socket'));

    socket.on('connect-to-room', roomId => {
        if (Room.rooms[roomId] == undefined) return socket.emit('room-not-found', `Room not found with id ${roomId}`);

        let room = Room.rooms[roomId];

        if (room.password) socket.emit('password-required');
        else return socket.emit('room-found', room.port);

        socket.on('room-pass-attempt', pwd => {
            if (room.password == pwd) socket.emit('room-found', room.port);
            else socket.emit('password-required');
        });
    });
});

roomFinder.listen(3031);

console.info('SOCK: Room Finder Socket Up! Listening on port 3031');
