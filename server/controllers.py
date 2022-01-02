import time
import lgpio
from PCA9685 import PCA9685


class Motor:
    def __init__(self):
        self.pwm = PCA9685(0x40, debug=True)
        self.pwm.set_pwm_freq(50)
        self.duty_max = 4095
    
    def constrain_duty(self, duty):
      result = min(duty, self.duty_max)
      result = max(result, -1 * self.duty_max)
      result = round(result)
      # Negative because motors were wired backwards (?)
      result = result * -1
      return result

    def control_left_upper_wheel(self, duty):
        if duty > 0:
            self.pwm.set_motor_pwm(0, 0)
            self.pwm.set_motor_pwm(1, duty)
        elif duty < 0:
            self.pwm.set_motor_pwm(1, 0)
            self.pwm.set_motor_pwm(0, abs(duty))
        else:
            self.pwm.set_motor_pwm(0, self.duty_max)
            self.pwm.set_motor_pwm(1, self.duty_max)

    def control_left_lower_wheel(self, duty):
        if duty > 0:
            self.pwm.set_motor_pwm(3, 0)
            self.pwm.set_motor_pwm(2, duty)
        elif duty < 0:
            self.pwm.set_motor_pwm(2, 0)
            self.pwm.set_motor_pwm(3, abs(duty))
        else:
            self.pwm.set_motor_pwm(2, self.duty_max)
            self.pwm.set_motor_pwm(3, self.duty_max)

    def control_right_upper_wheel(self, duty):
        if duty > 0:
            self.pwm.set_motor_pwm(6, 0)
            self.pwm.set_motor_pwm(7, duty)
        elif duty < 0:
            self.pwm.set_motor_pwm(7, 0)
            self.pwm.set_motor_pwm(6, abs(duty))
        else:
            self.pwm.set_motor_pwm(6, self.duty_max)
            self.pwm.set_motor_pwm(7, self.duty_max)

    def control_right_lower_wheel(self, duty):
        if duty > 0:
            self.pwm.set_motor_pwm(4, 0)
            self.pwm.set_motor_pwm(5, duty)
        elif duty < 0:
            self.pwm.set_motor_pwm(5, 0)
            self.pwm.set_motor_pwm(4, abs(duty))
        else:
            self.pwm.set_motor_pwm(4, self.duty_max)
            self.pwm.set_motor_pwm(5, self.duty_max)

    def set_duty(self, duty1, duty2, duty3, duty4):
        self.control_left_upper_wheel(self.constrain_duty(duty1))
        self.control_left_lower_wheel(self.constrain_duty(duty2))
        self.control_right_upper_wheel(self.constrain_duty(duty3))
        self.control_right_lower_wheel(self.constrain_duty(duty4))


class Servo:
    def __init__(self):
        self.pwm = PCA9685(0x40, debug=True)
        self.pwm.set_pwm_freq(50)
        self.pwm.set_servo_pulse(8, 1500)
        self.pwm.set_servo_pulse(9, 1500)

    def set_servo_pwm(self, channel, angle, error=1):
        angle = int(angle)
        if channel == "0":
            self.pwm.set_servo_pulse(8, 2500 - int((angle + error) / 0.09))
        elif channel == "1":
            self.pwm.set_servo_pulse(9, 500 + int((angle + error) / 0.09))
        elif channel == "2":
            self.pwm.set_servo_pulse(10, 500 + int((angle + error) / 0.09))
        elif channel == "3":
            self.pwm.set_servo_pulse(11, 500 + int((angle + error) / 0.09))
        elif channel == "4":
            self.pwm.set_servo_pulse(12, 500 + int((angle + error) / 0.09))
        elif channel == "5":
            self.pwm.set_servo_pulse(13, 500 + int((angle + error) / 0.09))
        elif channel == "6":
            self.pwm.set_servo_pulse(14, 500 + int((angle + error) / 0.09))
        elif channel == "7":
            self.pwm.set_servo_pulse(15, 500 + int((angle + error) / 0.09))

    def center(self):
        self.set_servo_pwm("0", 90)
        self.set_servo_pwm("1", 90)

class Buzzer:
  def __init__(self):
    self.buzzer_pin = 17
    self.handle = lgpio.gpiochip_open(0)
    lgpio.gpio_claim_output(self.handle, self.buzzer_pin)
    lgpio.gpio_write(self.handle, self.buzzer_pin, 0)
  
  def beep(self):
    lgpio.gpio_write(self.handle, self.buzzer_pin, 1)
    time.sleep(0.01)
    lgpio.gpio_write(self.handle, self.buzzer_pin, 0)
  
  def play(self):
    lgpio.gpio_write(self.handle, self.buzzer_pin, 1)
  
  def pause(self):
    lgpio.gpio_write(self.handle, self.buzzer_pin, 0)

  def stop(self):
    lgpio.gpio_write(self.handle, self.buzzer_pin, 0)
    lgpio.gpiochip_close(self.handle)
