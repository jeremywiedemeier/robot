from motor import *

if __name__=='__main__':
  try:
    PWM.setMotorModel(2000,2000,2000,2000)
    time.sleep(1)
    PWM.setMotorModel(-2000,-2000,-2000,-2000)
    time.sleep(1)
    PWM.setMotorModel(-500,-500,2000,2000)
    time.sleep(1)
    PWM.setMotorModel(2000,2000,-500,-500)
    time.sleep(1)
    PWM.setMotorModel(0,0,0,0)

  except:
    PWM.setMotorModel(0,0,0,0)