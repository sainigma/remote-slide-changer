import { ServerComms } from './components/ServerComms.js'
import './styles.css'
let comms

const CreateConnector = (parent) => {
  const container = document.createElement('d')
  comms.setConnector(container)
  container.className = 'connector'
  CreateButton(container, 'buttonwide buttonconnect buttonbottom', ()=>{comms.connect('abcdefg')})
  parent.appendChild(container)
}

const CreateKeypad = (parent) => {
  const container = document.createElement('d')
  comms.setUI(container)
  container.className = 'keypad'
  CreateButton(container, 'bigbutton bigbuttontop', ()=>{comms.send('up')})
  CreateButton(container, 'bigbutton bigbuttonleft', ()=>{comms.send('left')})
  CreateButton(container, 'bigbutton bigbuttonright', ()=>{comms.send('right')})
  CreateButton(container, 'bigbutton bigbuttonbottom buttonbottom', ()=>{comms.send('down')})
  parent.appendChild(container)
}

const CreateButton = (parent, className, func, label) => {
  const d = document.createElement('d')
  d.className = className
  if( label !== undefined ){
    d.innerHTML = label
  }
  d.onclick = () => {func()}
  parent.appendChild(d)
}

const init = () => {
  let container
  comms = new ServerComms()
  container = document.getElementById('root')
  CreateKeypad(container)
  CreateConnector(container)
  //comms.connect('abcdefg')
}

init()