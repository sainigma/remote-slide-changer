export class ServerComms{
  constructor(){
    this.socket = undefined
    this.groupid = undefined
    this.handshaked = false
    this.wsock = 'ws://localhost:2048'
    this.ui = undefined
    this.connector = undefined
  }
  setUI(ui){
    this.ui = ui
  }
  setConnector(connector){
    this.connector = connector
  }
  connect(groupid){
    if( groupid !== undefined ){
      this.socket = undefined
      this.handshaked = false
      this.groupid = groupid

      this.socket = new WebSocket(this.wsock)
      this.socket.onclose = () => {
        this.disable()
      }
      this.socket.onopen = (transmission) => {
        if( !this.handshaked ){
          transmission = JSON.stringify({role:'client',action:'handshake',groupid:this.groupid})
          console.log(transmission)
        }
        try{
          this.socket.send(transmission)
        }catch(e){}
      }
      this.socket.onmessage = (data) => {
        switch(data.data){
          case 'handshaked':
            this.ui.style.display = 'block'
            this.connector.style.display = 'none'
            this.handshaked = true
            break
          case 'disable':
            this.disable()
            break
        }
      }
    }else return false
  }
  disable(){
    if( this.ui !== undefined ){
      this.ui.style.display = 'none'
      this.connector.style.display = 'block'
    }
  }
  send(action){
    if( !this.handshaked ){
      this.disable()
      return false
    }
    let transmission = {
      role: 'client',
      action: action
    }
    transmission = JSON.stringify(transmission)
    this.socket.onopen(transmission)
  }
}