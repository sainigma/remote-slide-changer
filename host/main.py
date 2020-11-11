#!/usr/bin/env python

import asyncio
import keyboard
import websockets
import json
import time

#uri = 'wss://1030321.xyz:2048'
uri = 'ws://localhost:2048'
config = {}
keyboardactions = {}
keyboardactions['up'] = 'up'
keyboardactions['down'] = 'down'
keyboardactions['left'] = 'left'
keyboardactions['right'] = 'right'
keyboardactions['space'] = 'space'

async def register():
  async with websockets.connect(uri) as websocket:
      transmission = {}
      transmission['role']='host'
      if( config['id'] == '' ):
        transmission['type']='newid'
        await websocket.send(json.dumps(transmission))
        response = await websocket.recv()
        if( response ):
          print(response)
          config['id'] = response
          config['active'] = True
      else:
        transmission['type']='register'
        transmission['id']=config['id']
        await websocket.send(json.dumps(transmission))
        response = await websocket.recv()
        if( response == 'registered' ):
          print('registration ok')
          config['active'] = True
      if(config['active']):
          await listen(websocket)
      else:
        print('failed to register connection')

def init():
  config['type'] = 'host'
  config['id'] = 'abcdefg'
  config['active'] = False
  try:
    asyncio.get_event_loop().run_until_complete(register())
  except:
    timeout = 5
    print('failed to connect to server')
    print('retrying in ',timeout,' seconds..')
    time.sleep(timeout)
    init()

async def listen(websocket):
  print('listening')
  while(True):
    response = await websocket.recv()
    if( response ):
      if( response in keyboardactions ):
        keyboard.press_and_release(keyboardactions[response])
      print( response )
    else:
      print('null')
      
init()