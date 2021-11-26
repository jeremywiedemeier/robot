import json
import asyncio
import websockets
from controllers import *

domain = "192.168.0.10"
port = 8765

motor = Motor()
servo = Servo()
buzzer = Buzzer()


async def control(websocket, path):
    async for message in websocket:

        input = json.loads(message)

        ### motor ###
        motor.set_duty(
            input["motor"]["fl"],
            input["motor"]["bl"],
            input["motor"]["fr"],
            input["motor"]["br"],
        )

        ### servo ###
        servo.set_servo_pwm("0", max(min(input["servo"]["x"], 120), 60))

        ### buzzer ###
        if input["buzzer"]["active"] == True:
            buzzer.play()
        else:
            buzzer.pause()

        await websocket.send(
            json.dumps(
                {
                    "motor": input["motor"],
                    "servo": input["servo"],
                    "buzzer": input["buzzer"],
                }
            )
        )


async def main():
    print("starting server on port " + str(port))
    async with websockets.serve(control, domain, port):
        await asyncio.Future()


try:
    asyncio.run(main())
except:
    motor.set_duty(0, 0, 0, 0)
    servo.center()
    buzzer.stop()
