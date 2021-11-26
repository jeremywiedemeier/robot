import sys
from controllers import *
from sensors import *

if __name__ == "__main__":
    servo = Servo()
    motor = Motor()
    ultrasonic = Ultrasonic()
    buzzer = Buzzer()

    if sys.argv[1] == "servo":
        try:
            for i in range(90, 110):
                servo.set_servo_pwm("0", i)
                time.sleep(0.01)

            for i in range(110, 70, -1):
                servo.set_servo_pwm("0", i)
                time.sleep(0.01)

            for i in range(70, 90, 1):
                servo.set_servo_pwm("0", i)
                time.sleep(0.01)

            for i in range(90, 150):
                servo.set_servo_pwm("1", i)
                time.sleep(0.01)

            for i in range(150, 90, -1):
                servo.set_servo_pwm("1", i)
                time.sleep(0.01)

        except:
            servo.set_servo_pwm("0", 90)
            servo.set_servo_pwm("1", 90)

    elif sys.argv[1] == "motor":
        try:
            motor.set_duty(2000, 2000, 2000, 2000)
            time.sleep(1)
            motor.set_duty(-2000, -2000, -2000, -2000)
            time.sleep(1)
            motor.set_duty(-500, -500, 2000, 2000)
            time.sleep(1)
            motor.set_duty(2000, 2000, -500, -500)
            time.sleep(1)
            motor.set_duty(0, 0, 0, 0)

        except:
            motor.set_duty(0, 0, 0, 0)

    elif sys.argv[1] == "ultrasonic":
      try:
        print("hi")
      except:
        print("hi")
        
    elif sys.argv[1] == "buzzer":
      try:
        buzzer.beep()
        buzzer.stop()
      except:
        buzzer.stop()

    elif sys.argv[1] == "avoid":
        try:

            def move_away(L, M, R):
                if (L < 30 and M < 30 and R < 30) or M < 30:
                    motor.set_duty(-1450, -1450, -1450, -1450)
                    time.sleep(0.1)
                    if L < R:
                        motor.set_duty(1450, 1450, -1450, -1450)
                    else:
                        motor.set_duty(-1450, -1450, 1450, 1450)

                elif L < 30 and M < 30:
                    motor.set_duty(1500, 1500, -1500, -1500)

                elif R < 30 and M < 30:
                    motor.set_duty(-1500, -1500, 1500, 1500)

                elif L < 20:
                    motor.set_duty(2000, 2000, -500, -500)
                    if L < 10:
                        motor.set_duty(1500, 1500, -1000, -1000)

                elif R < 20:
                    motor.set_duty(-500, -500, 2000, 2000)
                    if R < 10:
                        motor.set_duty(-1500, -1500, 1500, 1500)

                else:
                    motor.set_duty(600, 600, 600, 600)

            # for i in range(30,151,60):
            #         self.pwm_S.setServoPwm('0',i)
            #         time.sleep(0.2)
            #         if i==30:
            #             L = self.get_distance()
            #         elif i==90:
            #             M = self.get_distance()
            #         else:
            #             R = self.get_distance()
            # while True:
            #     for i in range(90,30,-60):
            #         self.pwm_S.setServoPwm('0',i)
            #         time.sleep(0.2)
            #         if i==30:
            #             L = self.get_distance()
            #         elif i==90:
            #             M = self.get_distance()
            #         else:
            #             R = self.get_distance()
            #         self.run_motor(L,M,R)
            #     for i in range(30,151,60):
            #         self.pwm_S.setServoPwm('0',i)
            #         time.sleep(0.2)
            #         if i==30:
            #             L = self.get_distance()
            #         elif i==90:
            #             M = self.get_distance()
            #         else:
            #             R = self.get_distance()
            #         self.run_motor(L,M,R)

        except:
          motor.set_duty(0, 0, 0, 0)

