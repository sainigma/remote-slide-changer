import { ServerComms } from './components/ServerComms.js'
import './styles.css'
let comms

const CreateField = (parent, className) => {
  const d = document.createElement('d')
  d.className = className
  const input = document.createElement('input')
  input.type = 'text'
  input.maxLength = 13
  input.placeholder = 'type id here'
  d.appendChild(input)
  parent.appendChild(d)
}
const CreateConnector = (parent) => {
  const container = document.createElement('d')
  comms.setConnector(container)
  container.className = 'connector'
  CreateField(container, 'connectfield')
  const p = document.createElement('p')
  p.innerHTML = 'Tekstiä tähän Loreakljflkjaflk lasjkflöa sfdlja sfdlkj alsfj alsjfd löajsfd lkjaf klj'
  container.appendChild(p)
  CreateButton(container, 'buttonwide buttonconnect buttonbottom buttonfilter', ()=>{comms.connect('abcdefg')})
  parent.appendChild(container)
}

const CreateKeypad = (parent) => {
  const container = document.createElement('d')
  comms.setUI(container)
  container.className = 'keypad'
  CreateButton(container, 'bigbutton bigbuttontop buttonfilter', ()=>{comms.send('up')})
  CreateButton(container, 'bigbutton bigbuttonleft buttonfilter', ()=>{comms.send('left')})
  CreateButton(container, 'bigbutton bigbuttonright buttonfilter', ()=>{comms.send('right')})
  CreateButton(container, 'bigbutton bigbuttonbottom buttonbottom buttonfilter', ()=>{comms.send('down')})
  CreateButton(container, 'bigbutton bigbuttonspace buttonfilter', ()=>{comms.send('down')})
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
}

init()