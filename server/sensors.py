import time
import lgpio


class Ultrasonic:
    def __init__(self):
        self.trigger_pin = 27
        self.echo_pin = 22
        self.handle = lgpio.gpiochip_open(0)
        lgpio.gpio_claim_output(self.handle, self.trigger_pin)
        lgpio.gpio_claim_output(self.handle, self.echo_pin)
        lgpio.gpio_write(self.handle, self.trigger_pin, 0)

    def close_pins(self):
        lgpio.gpio_write(self.handle, self.trigger_pin, 0)

    def wait_for_echo(self, timeout):
        count = timeout
        while lgpio.gpio_read(self.handle, self.echo_pin) == False and count > 0:
            count = count - 1
        print("count", count)

    def get_distance(self):
        distance_cm = [0, 0, 0, 0, 0]

        for i in range(1):

            # Send trigger pulse
            lgpio.gpio_write(self.handle, self.trigger_pin, 1)
            time.sleep(0.00015)
            lgpio.gpio_write(self.handle, self.trigger_pin, 0)

            start = time.time()
            # Countdown too fast?
            self.wait_for_echo(10000)
            finish = time.time()

            print("time: ", finish - start)

            distance_cm[i] = (finish - start) / 0.000058

        return distance_cm

        # Return median value
        # return int(sorted(distance_cm)[2])


if __name__ == "__main__":
    ultrasonic = Ultrasonic()
    try:
        print(ultrasonic.get_distance())
        ultrasonic.close_pins()
    except:
        ultrasonic.close_pins()
