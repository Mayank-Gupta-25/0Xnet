const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const clients = new Set();

// Web socket connection handling

wss.on("connection", (ws)=>{
    console.log("🟢 Client connected");
    clients.add(ws);
    console.log("connect");
    
    ws.on("message",(message)=>{
        const data = JSON.parse(message);

        //broadcasting to all except sender
        clients.forEach(client =>{
            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on("close",()=>{
        console.log("🔴 Client disconnected");
        clients.delete(ws);
    });
});


const PORT = 3000;
server.listen(PORT, ()=>{
    console.log(`🚀 0Xnet server running on port ${PORT}`);
});


