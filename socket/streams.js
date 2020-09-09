module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('refresh', (data) => {
            io.emit('refreshPage', data);
         })
        socket.on('sendchat', (data) => {
            io.emit('chatRecieve', data);
         })
     })
}