import openSocket from 'socket.io-client';
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"

//const socket = openSocket('https://safe-spire-52863.herokuapp.com/');
//const socket = openSocket('http://localhost:3011/');
let socket
if (jwtDefaultConfig.CURRENT_ENVIREMENT == "development") {
    socket = openSocket(jwtDefaultConfig.socketURL);
} else if (jwtDefaultConfig.CURRENT_ENVIREMENT == "production") {
    socket = openSocket(jwtDefaultConfig.socketURL, {
        path: "/ds/socket/"
    });
}

module.exports.subscribe = function (tripId, cb) {
    socket.on('message', timestamp => cb(null, timestamp));
    socket.emit('subscribe', tripId);
}

module.exports.unsubscribe = function (tripId, cb) {
    socket.emit('unsubscribe', tripId);
}

module.exports.receivedRealTimeNotification = function (RoomID, cb) {
    socket.emit('subscribe', RoomID);
    socket.on('emitRealTimeNotification', notification => cb(null, notification))
}

module.exports.disconnectClient = function () {
    socket.emit('disconnect', 'reloading')
}


module.exports.ontripVehicles = function (RoomID, cb) {
    socket.emit('subscribe', RoomID);
    socket.on('ontripVehiclesForControltower', ontripVehicles => cb(null, ontripVehicles))

}

module.exports.freeVehicles = function (RoomID, cb) {
    socket.emit('subscribe', RoomID);
    socket.on('freeVehiclesForControltower', ontripVehicles => cb(null, ontripVehicles))

}