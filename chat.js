var io = require('socket.io').listen(9090);
var onlineUsers = {};

var whoIsOnline = function () {
  io.sockets.emit('online', onlineUsers);
}

io.sockets.on('connection', function(socket){

    socket.on('start', function(user){
        console.log(user + ' se conecto a la sala de chat');

        onlineUsers[socket.id] = user.trim();
        console.log(onlineUsers);

        socket.emit('connected', user);

        whoIsOnline();

        io.sockets.emit('join', user + ' ha ingresado al chat');
    });

    socket.on("disconnect", function() {
      const currentUser = onlineUsers[socket.id];
      console.log(currentUser + " se desconecto a la sala de chat");
      io.sockets.emit("left", currentUser + " ha abandonado el chat");
      
      if (currentUser && currentUser !== "undefined" ) {
        delete onlineUsers[socket.id];
        whoIsOnline();
      }
    });

    socket.on("newMsg", function (message){
      
      const d = new Date();
      
      const newMessage = {
        text: message,
        time: d.getHours() + ':' + d.getSeconds(),
        userId: socket.id,
        userName: onlineUsers[socket.id]
      }
      console.log(newMessage);

      //socket.emit("recMsg", message); //only for the source client
      io.sockets.emit("recMsg", newMessage); // for the all clients
    })

});