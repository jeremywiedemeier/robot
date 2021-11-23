import asyncio
import websockets
from controllers import *

domain = "192.168.0.10"
port = 8765

motor = Motor()

async def move(websocket, path):
  print("running move()")
  async for message in websocket:
    print("message: " + message)

    if ("s" in message):
      # Move back
      motor.move_back(1)
      print("back")

    elif ("a" in message):
      # Move left
      motor.move_left(1)
      print("left")

    elif ("d" in message):
      # Move right
      motor.move_right(1)
      print("right")
      
    elif ("w" in message):
      # Move forward
      motor.move_forward(1)
      print("forward")

    elif (message == ""):
      print("cancel")
      motor.stop()

    await websocket.send("sup: " + message)

async def main():
  print("starting server on port " + str(port))
  async with websockets.serve(move, domain, port):
    await asyncio.Future()

asyncio.run(main())