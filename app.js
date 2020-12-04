const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const Table = require('./models/table');

const registerRoute = require('./routers/api/register');
const authRoute = require('./routers/api/auth');
const tablesRoute = require('./routers/api/tables');
const checkRoute = require('./routers/api/check-auth');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origin: "*",
    }
});

const socket = require('./utils/socket-events');
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/register', registerRoute);
app.use('/api/auth', authRoute);
app.use('/api/tables', tablesRoute);
app.use('/api/check-auth', checkRoute);

mongoose
    .connect(
        config.get('mongoURI'),
        { 
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        }
    )
    .then(result => {
        console.log('[Secret Table Backend 🤫]');
        console.log('MongoDB contected...');
        app.listen(port, () => console.log(`Listening server on port ${port}...`));
        io.listen(3002);
        
        io.on('connection', (socket) => {
            console.log('New client connected');

            // Join to table
            const {tableId} = socket.handshake.query;
            let TID = 0;
            socket.join(tableId);
    
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });

            socket.on('change', (data) => {
                console.log(JSON.stringify(data));
                io.in(tableId).emit('change', data);
                
                clearTimeout(TID);
                TID = setTimeout( () => {
                    Table.findById(tableId).then( table => {
                        const {content} = table;
                        const {row, column, text} = data;
                        content[row][column].text = text;
                        table.content = content;
                        
                        Table.findByIdAndUpdate(tableId, table, (err, doc) => {
                            if(err) console.log(err);
                        });
                    });
                }, 400);
            });

            socket.on('focus', (data) => {
                console.log(JSON.stringify(data));
                io.in(tableId).emit('focus', data);
            });

            socket.on('blur', (data) => {
                console.log(JSON.stringify(data));
                io.in(tableId).emit('blur', data);
            });

            socket.on('add_row', (data) => {
                console.log('add_row', JSON.stringify(data));
                io.in(tableId).emit('add_row', data);

                Table.findById(tableId).then( table => {
                    const cell = {text: ''};
                    const {content} = table;
                    content.push(content[0].map( () => cell));
                    table.content = content;
                    
                    Table.findByIdAndUpdate(tableId, table, (err, doc) => {
                        if(err) console.log(err);
                    });
                });
            });

            socket.on('add_column', (data) => {
                console.log('add_column', JSON.stringify(data));
                io.in(tableId).emit('add_column', data);

                Table.findById(tableId).then( table => {
                    const cell = {text: ''};
                    const {content} = table;
                    for(let i=0; i<content.length; i++) {
                        content[i].push(cell);
                    }
                    table.content = content;
                    
                    Table.findByIdAndUpdate(tableId, table, (err, doc) => {
                        if(err) console.log(err);
                    });
                });
            });
        });
    })
    .catch(err => {
        console.log(err);
    });