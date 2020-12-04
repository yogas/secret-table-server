const events = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        }) 
    });

    io.on('change', (data) => {
        console.log(data);
    })
}

module.exports = {events};