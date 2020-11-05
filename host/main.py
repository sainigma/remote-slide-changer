#!/usr/bin/env python

import asyncio
import websockets
import json
uri = 'ws://localhost:2048'
config = {}

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
    print('failed to connect to server')

async def listen(websocket):
  print('listening')
  while(True):
    response = await websocket.recv()
    if( response ):
      print( response )
    else:
      print('null')
      
init()