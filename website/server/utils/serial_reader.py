import serial
import json
import threading
import os

data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'data.json')

def read_serial(port='COM3', baudrate=9600):  # <-- Update COM3 to match your actual serial port
    ser = serial.Serial(port, baudrate)
    while True:
        line = ser.readline().decode('utf-8').strip()
        try:
            data = json.loads(line)
            with open(data_path, 'w') as f:
                json.dump(data, f)
        except json.JSONDecodeError:
            print("Invalid JSON:", line)

def start_serial_reader():
    thread = threading.Thread(target=read_serial, daemon=True)
    thread.start()
