import json
import asyncio
import websockets
from controllers import *
from sensors import *

domain = "192.168.0.10"
port = 8765

motor = Motor()
servo = Servo()
buzzer = Buzzer()
ultrasound = Ultrasound()


async def control(websocket, path):

    state = {
        "ultrasound": {"last_measurement": None},
    }

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
        # -8 degree servo_x_angle fudge
        servo_x_angle = input["servo"]["x"]
        servo_x_angle = min(servo_x_angle, 120)
        servo_x_angle = max(servo_x_angle, 60)
        servo.set_servo_pwm("0", servo_x_angle )

        ### buzzer ###
        if input["buzzer"]["active"] == True:
            buzzer.play()
        else:
            buzzer.pause()

        ### ultrasound ###
        if input["ultrasound"]["active"] == True:
            state["ultrasound"]["last_measurement"] = ultrasound.get_distance()

        await websocket.send(
            json.dumps(
                {
                    "motor": input["motor"],
                    "servo": input["servo"],
                    "buzzer": input["buzzer"],
                    "ultrasound": state["ultrasound"],
                }
            )
        )


async def main():
    servo.center()
    print("starting server on port " + str(port))
    async with websockets.serve(control, domain, port):
        await asyncio.Future()


try:
    asyncio.run(main())
except:
    motor.set_duty(0, 0, 0, 0)
    servo.center()
    buzzer.stop()
