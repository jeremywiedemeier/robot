import time
import lgpio


class Ultrasound:
    def __init__(self):
        self.trigger_pin = 27
        self.echo_pin = 22
        self.handle = lgpio.gpiochip_open(0)
        lgpio.gpio_claim_output(self.handle, self.trigger_pin)
        lgpio.gpio_claim_input(self.handle, self.echo_pin)
        lgpio.gpio_write(self.handle, self.trigger_pin, 0)

        self.is_measuring = False
        self.FUDGE_FACTOR = 1.0684

    def close_pins(self):
        lgpio.gpio_write(self.handle, self.trigger_pin, 0)
        lgpio.gpiochip_close(self.handle)

    # Returns distance in centimeters
    def get_distance(self):

        if self.is_measuring == True:
            return None

        self.is_measuring = True

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

        self.is_measuring = False

        # Using speed of ultrasound in air 330 m/s
        return (finish - start) / 2 * 33000 * self.FUDGE_FACTOR


if __name__ == "__main__":
    ultrasound = Ultrasound()
    try:
        trials = 10
        distances = [0 for _ in range(trials)]
        for i in range(trials):
            time.sleep(100 / 1000)
            distances[i] = ultrasound.get_distance()
            print(i, ") Distance(cm): ", distances[i])

        print("Average: ", sum(distances) / len(distances))

        ultrasound.close_pins()
    except:
        ultrasound.close_pins()
