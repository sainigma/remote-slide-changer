#!/usr/bin/env python
import sys
import asyncio
import keyboard
import websockets
import json
import time

uri = 'wss://1030321.xyz:2048'
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
        print(' connected')
        response = await websocket.recv()
        if( response ):
          print(response)
          config['id'] = response
          config['active'] = True
      else:
        transmission['type']='register'
        transmission['id']=config['id']
        await websocket.send(json.dumps(transmission))
        print(' connected')
        response = await websocket.recv()
        if( response == 'registered' ):
          print(' registration ok')
          config['active'] = True
      if(config['active']):
          await listen(websocket)
      else:
        print(' failed to register connection')

async def listen(websocket):
  print(' listening, use ctrl+c to quit')
  while(True):
    response = await websocket.recv()
    if( response ):
      if( response in keyboardactions ):
        keyboard.press_and_release(keyboardactions[response])
      #print( response )
    else:
      print('null')

def init():
  config['type'] = 'host'
  config['active'] = False
  try:
    asyncio.get_event_loop().run_until_complete(register())
  except KeyboardInterrupt:
    print('exiting, have a nice day')
  except:
    timeout = 5
    print(' failed to connect to server')
    print(' retrying in ',timeout,' seconds..')
    time.sleep(timeout)
    init()

def main():
  ok = False
  if len(sys.argv) > 1:
    ok = True
    print('connecting using identifier',sys.argv[1])
    config['id'] = sys.argv[1]
  else:
    ok = False
    while(not ok):
      id = input('set identifier for host: ')
      if len(id)>2:
        ok = True
        config['id'] = id
      else:
        print(' invalid length for id, must be at least 3 characters\n')
  if ok:
    init()

main()