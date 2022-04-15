class Room {
    #host;
    #roomId;
    #password;
    #idleTimer;
    #winningScore;
    #playerLimit;
    #inProgress;

    #playerCount = 0;
    #cardSetInUse = [];

    static rooms = {};

    constructor({ roomId, host, password, idleTimer, winningScore, playerLimit, cardSet = [], inProgress }) {
        this.#host = host;
        this.#roomId = roomId;
        this.#password = password;
        this.#idleTimer = idleTimer;
        this.#winningScore = winningScore;
        this.#playerLimit = playerLimit;
        this.#inProgress = inProgress || false;

        Room.rooms[roomId] = this;
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
}

module.exports = Room;
