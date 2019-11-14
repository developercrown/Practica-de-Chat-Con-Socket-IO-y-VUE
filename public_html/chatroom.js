var socket;
var URL = "http://192.168.2.12:9090";

var onlineUsers = {};

socket = io.connect(URL);

// socket.emit("start");

socket.on("connected", function(user) {
  console.log('====================================');
  console.log((user + ' te haz conectado correctamente').toUpperCase());
  console.log('====================================');
});

socket.on("disconnect", function() {
  socket.emit("disconnect", this.myUser);
});

socket.on("online", function(onlineUsers) {
  app.onlineUsers = onlineUsers;
});

socket.on("join", function(messageText) {
  alertify.success(messageText);
});

socket.on("left", function(messageText) {
  alertify.error(messageText);
});

socket.on("recMsg", function(message) {
  app.messages.push(message);
  console.log('====================================');
  console.log(app.messages);
  console.log('====================================');
});


var app = new Vue({
  el: "#app",
  data: {
    text: "",
    myUser: "",
    onlineUsers: {},
    messages: []
  },
  methods: {
    send: function() {
      const message = this.text.trim();
      console.log("sending message " + message);
      socket.emit("newMsg", message);
      this.text = "";
    },
    saveUser: function() {
      document.getElementById("user-modal").style.display = "none";
      console.log("====================================");
      console.log("connecting");
      console.log("====================================");
      socket.emit("start", this.myUser);
    }
  }
});