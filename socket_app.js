var UserInfo = require('./models/userInfo');
var Message = require('./models/message');

var socket_app = function (io) {
    io.on('connection', function (socket) {

        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
        socket.on('socketToMe', function (data) {
            console.log(data);
        });

    });
}



module.exports.init = socket_app;