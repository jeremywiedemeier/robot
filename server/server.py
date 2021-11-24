import json
import asyncio
import websockets
from controllers import *

domain = "192.168.0.10"
port = 8765

motor = Motor()
servo = Servo()


async def move(websocket, path):
    async for message in websocket:

        input = json.loads(message)

        motor.set_duty(
            input["motor"]["fl"],
            input["motor"]["bl"],
            input["motor"]["fr"],
            input["motor"]["br"],
        )

        servo.set_servo_pwm("0", max(min(input["servo"]["x"], 120), 60))

        await websocket.send(json.dumps({"motor": input["motor"], "servo": input["servo"]}))


async def main():
    print("starting server on port " + str(port))
    async with websockets.serve(move, domain, port):
        await asyncio.Future()


try:
    asyncio.run(main())
except:
    motor.stop()
