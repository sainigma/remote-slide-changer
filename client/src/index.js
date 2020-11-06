import { ServerComms } from './components/ServerComms.js'
import { CreateField } from './components/CreateField.js'
import './styles.css'
let comms


const CreateConnector = (parent) => {
  const container = document.createElement('d')
  comms.setConnector(container)
  container.className = 'connector'
  const inputfield = new CreateField(container, 'connectfield')
  inputfield.spawn()
  const p = document.createElement('p')
  p.innerHTML = 'Tekstiä tähän Loreakljflkjaflk lasjkflöa sfdlja sfdlkj alsfj alsjfd löajsfd lkjaf klj'
  container.appendChild(p)
  const connectbutton = CreateButton(container, 'buttonwide buttonconnect buttonbottom buttonfilter', ()=>{comms.connect(inputfield.getId())})
  inputfield.appendDependants(connectbutton)
  inputfield.disableDependants()
  parent.appendChild(container)
}

const CreateKeypad = (parent) => {
  const container = document.createElement('d')
  comms.setUI(container)
  container.className = 'keypad'
  CreateButton(container, 'idfield', undefined, `<p style="font-size:1.5em; padding-top:1em">Connected to:</p><p name='groupid'></p>`)
  CreateButton(container, 'bigbutton bigbuttontop buttonfilter', ()=>{comms.send('up')})
  CreateButton(container, 'hostfield', undefined, `<p style="font-size:1.5em; padding-top:1em">Active hosts:</p><p name='hostsconnected'>0</p>`)
  CreateButton(container, 'bigbutton bigbuttonleft buttonfilter', ()=>{comms.send('left')})
  CreateButton(container, 'bigbutton bigbuttonright buttonfilter', ()=>{comms.send('right')})
  CreateButton(container, 'bigbutton bigbuttonbottom buttonbottom buttonfilter', ()=>{comms.send('down')})
  CreateButton(container, 'bigbutton bigbuttonspace buttonfilter', ()=>{comms.send('down')})
  parent.appendChild(container)
  return container
}

const CreateButton = (parent, className, func, label) => {
  const d = document.createElement('d')
  d.className = className
  if( label !== undefined ){
    d.innerHTML = `${label}`
  }
  d.onclick = () => {func()}
  parent.appendChild(d)
  return d
}

const init = () => {
  let container
  comms = new ServerComms()
  container = document.getElementById('root')
  CreateKeypad(container)
  CreateConnector(container)
}

init()