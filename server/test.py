from motor import *
from servo import *

servo = Servo()

try:
  while True:
    for i in range(50, 110, 1):
      servo.set_servo_pwm('0', i)
      time.sleep(0.02)

    for i in range(110, 50, -1):
      servo.set_servo_pwm('0', i)
      time.sleep(0.02)

    for i in range(80, 150, 1):
      servo.set_servo_pwm('1', i)
      time.sleep(0.02)

    for i in range(150, 80, -1):
      servo.set_servo_pwm('1', i)
      time.sleep(0.02)

except:
  servo.set_servo_pwm('0', 90)
  servo.set_servo_pwm('1', 90)