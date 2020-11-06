const WebSocket = require('ws')
const app = require('express')
const crypto = require('crypto')
let hosts = {}
let clients = {}
let config

const hostActions = async(socket, data) => {
  const generateID = async(length) => {
    if( length === undefined ){
      length = 8
    }
    return crypto.randomBytes(length).toString('hex')
  }
  const appendHost = async(groupidentifier) => {
    if( !(groupidentifier in hosts) ){
      hosts[groupidentifier] = {}
    }
    const socketid = await generateID(20)
    hosts[groupidentifier][socketid] = socket
  }

  switch(data.type){
    case 'register':
      if( data.id !== undefined ){
        appendHost(data.id, socket)
        socket.send('registered')
      }
      break
    case 'newid':
      const groupidentifier = await generateID()
      appendHost(groupidentifier, socket)
      socket.send(groupidentifier)
      break
  }
}

const transmit = (groupid, action) => {
  if( groupid in hosts ){
    const keys = Object.keys(hosts[groupid])
    keys.forEach((key)=>{
      hosts[groupid][key].send(action)
    })
  }
}

const clientActions = (socket, data) => {
  switch(data.action){
    case 'handshake':
      if( data.groupid ){
        console.log(data.groupid)
        socket.groupid = data.groupid
        socket.send('handshaked')
        let hostsConnected = 0
        if( data.groupid in hosts ){
          hostsConnected = hosts[data.groupid].length
        }
        socket.send(JSON.stringify({hosts:hostsConnected}))
      }
      break
    case 'up':
    case 'down':
    case 'left':
    case 'right':
    case 'space':
      if( socket.groupid !== undefined ){
        console.log(data.action)
        transmit( socket.groupid, data.action )
      }else{
        socket.send('disable')
      }
      break
  }
}

const initSocket = (socket) => {
  socket.on('message', (data)=>{
    console.log('incoming')
    if( data !== undefined ){
      ok = true
      try{
        data = JSON.parse(data)
        console.log(data)
      }catch(e){ok = false; console.log('undefined message'); socket.send('undefined message')}
      if( ok && data.role !== undefined ){
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