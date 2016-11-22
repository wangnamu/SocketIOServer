var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var ioredis = require('socket.io-redis');
var redis = require("redis");
var config = require('./config');


var client = redis.createClient(config.data_redis_config);
io.adapter(ioredis(config.socketio_redis_config));
var emitter = require('socket.io-emitter')(config.emitter_config);

var routes = require('./routes/index');
var users = require('./routes/users');
var push = require('./routes/push');


//var socket_app = require('./socket_app').init(io);

var UserInfo = require('./models/userInfo');

// var a = new UserInfo();
// a.Id = 1;
// a.Name = "a";

// console.log(a);

// client.on('connect', function () {
//  // client.hmset('a', a, redis.print);

//   client.hgetall("bb", function (err, res) {
//     if (err) {
//       console.log('Error:' + err);
//       return;
//     }
//     if(res)
//     console.dir(res);
//   });

//   client.keys('*', function (err, keys) {
//     if (err) return console.log(err);

//     for (var i = 0, len = keys.length; i < len; i++) {
//       console.log(keys[i]);
//     }
//   });


//  });

app.use(function (req, res, next) {
  req.client = client;
  res.emitter = emitter;
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', routes);
app.use('/users', users);
app.use('/push', push);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}



// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


io.on('connection', function (socket) {

  socket.on('login', function (data) {
    console.log(data);
    var user = data;
    socket.SID = user.SID;
    user.IsOnline = true;
    client.hmset(user.SID, user, redis.print);
    socket.join(user.SID);
    socket.to(user.SID).emit('login_res', user);
  });


  socket.on('logoff', function (data) {
    console.log(data);
    var user = data;
    user.IsOnline = false;
    client.hmset(user.SID, user, redis.print);
    socket.to(user.SID).emit('logoff_res', user);
    socket.leave(user.SID);
    socket.disconnect();
  });

  socket.on('disconnect', function () {
    console.log('disconnect' + socket.SID);
    client.hgetall(socket.SID, function (err, user) {
      if (err) {
        console.log('Error:' + err);
        return;
      }
      if (user) {
        user.IsOnline = false;
        socket.leave(user.SID);
        client.hmset(user.SID, user, redis.print);
      }
    });
  });

});


module.exports = { app: app, server: server };
