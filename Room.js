const { Server } = require('socket.io');

class Room {
    #host;
    #roomId;
    #password;
    #idleTimer;
    #winningScore;
    #playerLimit;
    #inProgress;
    #port;
    #gameSocket;
    #hostSocket;

    #hostPassword;

    #playerCount = 0;
    #cardSetInUse = [];
    #playerList = [];

    static rooms = {};
    static portsInUse = {};

    constructor({ roomId, host, password, idleTimer, winningScore, playerLimit, inProgress, hostPassword }) {
        this.#host = host;
        this.#roomId = roomId;
        this.#password = password;
        this.#idleTimer = idleTimer;
        this.#winningScore = winningScore;
        this.#playerLimit = playerLimit;
        this.#inProgress = inProgress || false;
        this.#hostPassword = hostPassword;

        this.newPlayer(host);
        this.#getOpenPort();
        this.#createSocket();

        Room.rooms[roomId] = this;
    }

    newPlayer(player) {
        this.#playerCount++;
        this.#playerList.push(player);
    }

    /**
     * @param {number[]} cardSet
     */
    set cardSetInUse(cardSet) {
        this.#cardSetInUse = cardSet;
    }

    get port() {
        return this.#port;
    }

    get host() {
        return this.#host;
    }

    get roomId() {
        return this.#roomId;
    }

    get playerLimit() {
        return this.#playerLimit;
    }

    get winningScore() {
        return this.#winningScore;
    }

    #createSocket() {
        let gameSocket = new Server({
            cors: {
                origin: '*',
            },
        });

        gameSocket.on('connection', socket => {
            console.info(`\t New User connected to port ${this.port}`);

            socket.once('identification', data => {
                let username = data.username;
                console.log(username);
                if (username != this.#host) return this.#playerList.push(username);

                if (username == this.#host && data.hostPassword == this.#hostPassword) this.#hostSocket = socket;


                socket.emit('init-player-list', JSON.stringify(this.#playerList));
            });
        });

        gameSocket.listen(this.port);
        console.info(`EVENT: New Room Created with id of ${this.roomId} at port ${this.port}`);

        this.#gameSocket = gameSocket;
    }

    #getOpenPort() {
        while (true) {
            let num = Math.floor(1000 + Math.random() * 9000);
            if (!Room.portsInUse[num]) {
                Room.portsInUse[num] = this.roomId;
                this.#port = num;
                break;
            }
        }
    }

    #closePort() {
        delete Room.portsInUse[num];
        this.#inProgress = false;
    }
}

module.exports = Room;
