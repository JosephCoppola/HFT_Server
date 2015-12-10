//Server Vars
var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = http.createServer(onRequest).listen(port);

var users = {};

var io = socketio(app);

//HTTP
function onRequest(request, response)
{
	response.writeHead(200,{"Content-Type":"text"});
	response.end();
}

setInterval(updateLoop,2000);

//When a socket connects, assign it's delegate functions
io.sockets.on("connection",function(socket){
	//Call these functions to hook up listener events
	console.log(socket.id + " has connected");
	onJoined(socket);
	onDisconnect(socket);
});

//When a new socket joins
var onJoined = function(socket){
	//Setting EventListener for join
	socket.on("join",function(data){
		console.log(data.name + " just joined");
		
		//var userName = data.name;
		var key = socket.id;
		//socket.username = userName;
		
		users[key] = socket;
		
		socket.join('room1');
		
		var message = "Joined Server";
		
		//Send a notification to the user
		socket.emit("notify",{name:data.name,msg:message});
	});
};

//On disconnect delete the user from the array and subtract from the global score
var onDisconnect = function(socket){
	//Hook up event listener
	socket.on('disconnect',function(data){
		io.sockets.in('room1').emit('notify',{name:data.name});
		var key = users.indexOf(socket.id);
		users.splice(key,1);
	});
}

function updateLoop()
{
	io.sockets.in('room1').emit('notify',{msg:"Update"});
}



