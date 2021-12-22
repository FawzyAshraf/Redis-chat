import express from 'express';
import { createClient } from 'redis';



const app = express();



import { createServer } from 'http';
import path from "path";
import { Server } from 'socket.io';


const server = createServer(app);
const io = new Server(server);
const __dirname = path.resolve();
let prevMessages = [];

//check if redis is working

app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
});



io.on('connection', socket=>{
    console.log('a user connected');

    (async () => {
        const client = createClient();
      
        client.on('error', (err) => console.log('Redis Client Error', err));
      
        await client.connect();
        prevMessages = await client.lRange('messages', 0, -1)
        socket.emit('getPrev', prevMessages);
      })();
      
    socket.on('chat message', async(msg, username)=>{
        const message = username + ": " + msg;
        (async () => {
            const client = createClient();
          
            client.on('error', (err) => console.log('Redis Client Error', err));
            await client.connect();
            await client.rPush('messages', message)
          })(); 
        io.emit('chat message', message);
    })

})



server.listen(3000, () => { 
     console.log('listening on *:4000');
});

