import time
from PCA9685 import PCA9685

def limit_magnitude (num, lim):
  return round(max(min(num, lim), -lim))


class Motor:
  def __init__(self):
    self.pwm = PCA9685(0x40, debug=True)
    self.pwm.set_pwm_freq(50)
        
  def control_left_upper_wheel(self, duty):
    if duty > 0:
      self.pwm.set_motor_pwm(0, 0)
      self.pwm.set_motor_pwm(1, duty)
    elif duty < 0:
      self.pwm.set_motor_pwm(1, 0)
      self.pwm.set_motor_pwm(0, abs(duty))
    else:
      self.pwm.set_motor_pwm(0, 4095)
      self.pwm.set_motor_pwm(1, 4095)

  def control_left_lower_wheel(self, duty):
    if duty > 0:
      self.pwm.set_motor_pwm(3, 0)
      self.pwm.set_motor_pwm(2, duty)
    elif duty < 0:
      self.pwm.set_motor_pwm(2, 0)
      self.pwm.set_motor_pwm(3, abs(duty))
    else:
      self.pwm.set_motor_pwm(2, 4095)
      self.pwm.set_motor_pwm(3, 4095)

  def control_right_upper_wheel(self, duty):
    if duty > 0:
      self.pwm.set_motor_pwm(6, 0)
      self.pwm.set_motor_pwm(7, duty)
    elif duty < 0:
      self.pwm.set_motor_pwm(7, 0)
      self.pwm.set_motor_pwm(6, abs(duty))
    else:
      self.pwm.set_motor_pwm(6, 4095)
      self.pwm.set_motor_pwm(7, 4095)

  def control_right_lower_wheel(self, duty):
    if duty > 0:
      self.pwm.set_motor_pwm(4, 0)
      self.pwm.set_motor_pwm(5, duty)
    elif duty < 0:
      self.pwm.set_motor_pwm(5, 0)
      self.pwm.set_motor_pwm(4, abs(duty))
    else:
      self.pwm.set_motor_pwm(4, 4095)
      self.pwm.set_motor_pwm(5, 4095)

  def set_duty(self, duty1, duty2, duty3, duty4):
    self.control_left_upper_wheel(-limit_magnitude(duty1, 4095))
    self.control_left_lower_wheel(-limit_magnitude(duty2, 4095))
    self.control_right_upper_wheel(-limit_magnitude(duty3, 4095))
    self.control_right_lower_wheel(-limit_magnitude(duty4, 4095))

  def move_left(self, power):
    self.set_duty(power * -500, power * -500, power * 2000, power * 2000)
  
  def move_right(self, power):
    self.set_duty(power * 2000, power * 2000, power * -500, power * -500)
  
  def move_forward(self, power):
    self.set_duty(power * 1000, power * 1000, power * 1000, power * 1000)
  
  def move_back(self, power):
    self.set_duty(power * -1000, power * -1000, power * -1000, power * -1000)
  
  def stop(self):
    self.set_duty(0, 0, 0, 0)


class Servo:
  def __init__(self):
    self.pwm = PCA9685(0x40, debug=True)
    self.pwm.set_pwm_freq(50)
    self.pwm.set_servo_pulse(8, 1500)
    self.pwm.set_servo_pulse(9, 1500)

  def set_servo_pwm(self, channel, angle, error=10):
    angle=int(angle)
    if channel=='0':
      self.pwm.set_servo_pulse(8, 2500-int((angle+error)/0.09))
    elif channel=='1':
      self.pwm.set_servo_pulse(9, 500+int((angle+error)/0.09))
    elif channel=='2':
      self.pwm.set_servo_pulse(10, 500+int((angle+error)/0.09))
    elif channel=='3':
      self.pwm.set_servo_pulse(11, 500+int((angle+error)/0.09))
    elif channel=='4':
      self.pwm.set_servo_pulse(12, 500+int((angle+error)/0.09))
    elif channel=='5':
      self.pwm.set_servo_pulse(13, 500+int((angle+error)/0.09))
    elif channel=='6':
      self.pwm.set_servo_pulse(14, 500+int((angle+error)/0.09))
    elif channel=='7':
      self.pwm.set_servo_pulse(15, 500+int((angle+error)/0.09))
