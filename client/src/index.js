import { ServerComms } from './components/ServerComms.js'
import { CreateField } from './components/CreateField.js'
import './styles.css'
let comms

const mobileStyles = () => {
  const head = document.getElementsByTagName('HEAD')[0]
  let re = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i
  if( navigator.userAgent.match(re) !== null ){
    const container = document.getElementById('container')
    const license = document.getElementById('license')
    const tail = document.getElementById('tail')
    container.style.width = '600px'
    container.style.transformOrigin = 'top left'
    const scale = window.screen.width/600
    container.style.transform = `scale(${scale})`
    license.style.marginLeft = '1em' 
    license.style.width = `calc(${window.innerWidth} - 1em)`
    tail.style.height = `${(window.screen.height/scale)}px`
  }
}

const CreateConnector = (parent) => {
  const container = document.createElement('d')
  comms.setConnector(container)
  container.className = 'connector'
  const inputfield = new CreateField(container, 'connectfield')
  inputfield.spawn()
  const p = document.createElement('p')
  p.innerHTML = 'Aggregates commands remotely from multiple clients to multiple hosts.</br><a target="_blank" href="https://github.com/sainigma/remote-slide-changer">Documentation</a>'
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
  CreateButton(container, 'hostfield', undefined, `<p style="font-size:1.5em; padding-top:1em">Active hosts:</p><p name='hostsconnected'>-</p>`)
  CreateButton(container, 'bigbutton bigbuttonleft buttonfilter', ()=>{comms.send('left')})
  CreateButton(container, 'bigbutton bigbuttonright buttonfilter', ()=>{comms.send('right')})
  CreateButton(container, 'bigbutton bigbuttonbottom buttonbottom buttonfilter', ()=>{comms.send('down')})
  CreateButton(container, 'bigbutton bigbuttonspace', ()=>{comms.send('space')})
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
  mobileStyles()
}

init()