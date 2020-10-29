const WebSocket = require('ws')
const app = require('express')
let config

const initSocket = (socket) => {
  console.log(Object.keys(socket))
  console.log(socket.protocol)
}

const init = (httpsServer, cfg) => {
  config = cfg
  const sockets = new WebSocket.Server({server:httpsServer})
  sockets.on('connection', (socket)=>{initSocket(socket)})
}

module.exports = {
  app,
  init
}