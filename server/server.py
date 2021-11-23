import json
import asyncio
import websockets
from controllers import *

domain = "192.168.0.10"
port = 8765

motor = Motor()


async def move(websocket, path):
    async for message in websocket:

        input = json.loads(message)

        motor.set_duty(
            input["motor"]["fl"],
            input["motor"]["bl"],
            input["motor"]["fr"],
            input["motor"]["br"],
        )

        await websocket.send(json.dumps({"motor": input["motor"]}))


async def main():
    print("starting server on port " + str(port))
    async with websockets.serve(move, domain, port):
        await asyncio.Future()


try:
    asyncio.run(main())
except:
    motor.stop()
