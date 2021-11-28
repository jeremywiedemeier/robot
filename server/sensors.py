import time
import lgpio


class Ultrasonic:
    def __init__(self):
        self.trigger_pin = 27
        self.echo_pin = 22
        self.handle = lgpio.gpiochip_open(0)
        lgpio.gpio_claim_output(self.handle, self.trigger_pin)
        lgpio.gpio_claim_input(self.handle, self.echo_pin)
        lgpio.gpio_write(self.handle, self.trigger_pin, 0)

        self.FUDGE_FACTOR = 1.0684

    def close_pins(self):
        lgpio.gpio_write(self.handle, self.trigger_pin, 0)
        lgpio.gpiochip_close(self.handle)

    # Returns distance in centimeters
    def get_distance(self):
        lgpio.gpio_write(self.handle, self.trigger_pin, 1)
        time.sleep(0.15 / 1000)
        lgpio.gpio_write(self.handle, self.trigger_pin, 0)

        # Wait for pulse on echo pin
        while lgpio.gpio_read(self.handle, self.echo_pin) == 0:
            continue

        # Measure echo pulse length
        count = 0
        start = time.time()
        while lgpio.gpio_read(self.handle, self.echo_pin) == 1 and count < 10000:
            count += 1
        finish = time.time()

        # Using speed of ultrasound in air 330 m/s
        return (finish - start) / 2 * 33000 * self.FUDGE_FACTOR


if __name__ == "__main__":
    ultrasonic = Ultrasonic()
    try:
        trials = 30
        distances = [0 for _ in range(trials)]
        for i in range(trials):
            time.sleep(100 / 1000)
            distances[i] = ultrasonic.get_distance()
            print(i, ") Distance(cm): ", distances[i])

        print("Average: ", sum(distances) / len(distances))

        ultrasonic.close_pins()
    except:
        ultrasonic.close_pins()
