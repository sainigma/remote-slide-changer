#!/usr/bin/env python

import asyncio
import websockets

async def test():
    uri = 'ws://localhost:2048'
    async with websockets.connect(uri) as websocket:
        await websocket.send("hello world")

asyncio.get_event_loop().run_until_complete(test())