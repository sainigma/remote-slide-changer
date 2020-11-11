const fs = require('fs')
const sockets = require('./sockets.js')
const http = require('http')
const https = require('https')

const config = JSON.parse(fs.readFileSync('.env'))

const init = () => {
  const credentials = {
    key: fs.readFileSync(config.privateKey),
    cert: fs.readFileSync(config.certificate)
  }
  let server
  if( config.wss ){
    server = https.createServer(credentials, sockets.app)
  }else{
    server = http.createServer(sockets.app)
  }
  server.listen(config.port)
  sockets.init(server, config)
}
init()