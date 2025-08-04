
import json
import threading
import time
import random
import serial
import time


from integration.supabase import supabase
latest_data = {}  # Shared in-memory data
use_simulation = False  # Will become True if serial connection fails

def simulate_data():
    latest = {}
    
    temp = round(random.uniform(30.0, 38.0), 2)
    hum = round(random.uniform(50.0, 60.0), 2)
    latest = {
        "temperature": temp,
        "humidity": hum
    }
   
    return latest

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
        while True:
            latest_data = simulate_data()
            time.sleep(1)  # update every second
        

   


def start_serial_reader(port='COM3', baudrate=9600):
    
    thread = threading.Thread(target=read_serial, kwargs={'port': port, 'baudrate': baudrate}, daemon=True)
    thread.start()


def get_latest_data():
    global latest_data
    return latest_data
def save_data_to_supabase(data):
    supabase.table('sensor_data').insert({
        'temperature': data.get('temperature'),
        'humidity': data.get('humidity')
    }).execute()



