import time
from PCA9685 import PCA9685

class Servo:
    def __init__(self):
        self.pwm = PCA9685(0x40, debug=True)
        self.pwm.setPWMFreq(50)
        self.pwm.setServoPulse(8, 1500)
        self.pwm.setServoPulse(9, 1500)

    def set_servo_pwm(self, channel, angle, error=10):
        angle=int(angle)
        if channel=='0':
            self.pwm.setServoPulse(8, 2500-int((angle+error)/0.09))
        elif channel=='1':
            self.pwm.setServoPulse(9, 500+int((angle+error)/0.09))
        elif channel=='2':
            self.pwm.setServoPulse(10, 500+int((angle+error)/0.09))
        elif channel=='3':
            self.pwm.setServoPulse(11, 500+int((angle+error)/0.09))
        elif channel=='4':
            self.pwm.setServoPulse(12, 500+int((angle+error)/0.09))
        elif channel=='5':
            self.pwm.setServoPulse(13, 500+int((angle+error)/0.09))
        elif channel=='6':
            self.pwm.setServoPulse(14, 500+int((angle+error)/0.09))
        elif channel=='7':
            self.pwm.setServoPulse(15, 500+int((angle+error)/0.09))
