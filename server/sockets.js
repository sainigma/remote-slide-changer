const WebSocket = require('ws')
const app = require('express')
let config

const hostActions = (socket, data) => {
  switch(data.type){
    case 'register':
      if( data.id !== undefined ){
        socket.send('registered')
      }
      break
    case 'newid':
      socket.send('abcdefg')
      break
  }
}

const clientActions = (socket, data) => {
}

const initSocket = (socket) => {
  socket.on('message', (data)=>{
    if( data !== undefined ){
      data = JSON.parse(data)
      console.log(data)
      if( data.role !== undefined ){
        if( data.role === 'host' ){
          hostActions(socket, data)
        }else if( data.role === 'client' ){
          clientActions(socket, data)
        }else{
          socket.send('unhandled connection')
        }
      }else{
        socket.send('unhandled connection')
      }
    }
  })
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