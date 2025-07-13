
import json
import threading
import time
import random
import serial

latest_data = {}  # Shared in-memory data
use_simulation = False  # Will become True if serial connection fails


def read_serial(port='COM3', baudrate=9600):
    global latest_data, use_simulation

    try:
        ser = serial.Serial(port, baudrate, timeout=1)
        print(f"[INFO] Connected to serial port: {port}")

        while True:
            line = ser.readline().decode('utf-8').strip()
            try:
                data = json.loads(line)
                latest_data = data
            except json.JSONDecodeError:
                print("Invalid JSON from serial:", line)

    except serial.SerialException as e:
        print(f"[WARN] Serial connection failed: {e}")
        print("[INFO] Switching to simulation mode...")
        use_simulation = True
        simulate_data()


def simulate_data():
    global latest_data
    while True:
        temp = round(random.uniform(25.0, 30.0), 2)
        hum = round(random.uniform(50.0, 60.0), 2)
        latest_data = {
            "temperature": temp,
            "humidity": hum
        }
        time.sleep(2)  # simulate data every 2 seconds


def start_serial_reader(port='COM3', baudrate=9600):
    thread = threading.Thread(target=read_serial, kwargs={'port': port, 'baudrate': baudrate}, daemon=True)
    thread.start()


def get_latest_data():
    return latest_data
