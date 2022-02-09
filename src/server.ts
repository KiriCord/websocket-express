import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

var i = 0;

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        console.log('Получено: %s', message);
        const broadcastRegex = /^broadcast\:/;

        if (broadcastRegex.test(message)) {
            message = message.replace(broadcastRegex, '');

            wss.clients
                .forEach(client => {
                    if (client != ws) {
                        client.send(`Клиент отправил -> ${message}`);
                    }    
                });
            
        } else {
            ws.send(`Вы отправили -> (${message})\n ТЕСТОВОЕ СООБЩЕНИЕ`);
        }

    });

    function sendMess() {
       ws.send(JSON.stringify({
           x: i * i,
           y: i * i + 1
       }));
       i++;
    }

    setInterval(() => { sendMess(); }, 5000);
});

server.listen(process.env.PORT || 8999, () => {
    console.log(`Сервер запущен ${server.address()}:)`);
});

