const fs = require('fs')
const sockets = require('./sockets.js')
const https = require('http')

const config = JSON.parse(fs.readFileSync('.env'))

const init = () => {
  const credentials = {
    key: fs.readFileSync(config.privateKey),
    cert: fs.readFileSync(config.certificate)
  }
  //const httpsServer = https.createServer(credentials, sockets.app)
  const httpsServer = https.createServer(sockets.app)
  httpsServer.listen(config.port)
  sockets.init(httpsServer, config)
}
init()