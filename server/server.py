import asyncio
import websockets

domain = "192.168.0.10"
port = 8765

async def echo(websocket, path):
  async for message in websocket:
    print(message)
    await websocket.send("sup: " + message)

async def main():
  async with websockets.serve(echo, domain, port):
    await asyncio.Future()

asyncio.run(main())