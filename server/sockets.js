const WebSocket = require('ws')
const app = require('express')
const crypto = require('crypto')
let hosts = {}
let clients = {}
let config

const generateID = async(length) => {
  if( length === undefined ){
    length = 8
  }
  return crypto.randomBytes(length).toString('hex')
}

const appendToSocketGroup = async(socket, group, groupidentifier, role) => {
  if( !(groupidentifier in group) ){
    group[groupidentifier] = {}
  }
  const id = await(generateID(20))
  socket.id = id
  socket.groupid = groupidentifier
  socket.role = role
  group[groupidentifier][id] = socket
}

const removeFromSocketGroup = async(socket, group) => {
  delete group[socket.groupid][socket.id]
}

const updateHostCountToClients = async(groupidentifier) => {
  if( groupidentifier in clients ){
    Object.keys(clients[groupidentifier]).forEach((key)=>{
      clients[groupidentifier][key].send(JSON.stringify({hosts:Object.keys(hosts[groupidentifier]).length}))
    })
  }
}

const hostActions = async(socket, data) => {
  const appendHost = async(groupidentifier) => {
    await appendToSocketGroup(socket, hosts, groupidentifier,'host')
    updateHostCountToClients(groupidentifier)
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
  const appendClient = async(groupidentifier) => {
    await appendToSocketGroup(socket, clients, groupidentifier, 'client')
  }
  switch(data.action){
    case 'handshake':
      if( data.groupid ){
        socket.send('handshaked')
        let hostsConnected = 0
        if( data.groupid in hosts ){
          hostsConnected = Object.keys(hosts[data.groupid]).length
        }
        socket.send(JSON.stringify({hosts:hostsConnected}))
        appendClient(data.groupid)
      }
      break
    case 'up':
    case 'down':
    case 'left':
    case 'right':
    case 'space':
      if( socket.groupid !== undefined ){
        transmit( socket.groupid, data.action )
      }else{
        socket.send('disable')
      }
      break
  }
}

const initSocket = (socket) => {
  socket.on('message', (data)=>{
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
  socket.on('close', ()=>{
    if('role' in socket){
      if( socket.role === 'client' ){
        removeFromSocketGroup(socket, clients)
      }else if( socket.role === 'host' ){
        removeFromSocketGroup(socket, hosts)
        updateHostCountToClients(socket.groupid)
      }
    }
    console.log(`closing ${socket.role} ${socket.id} from group ${socket.groupid}`)
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