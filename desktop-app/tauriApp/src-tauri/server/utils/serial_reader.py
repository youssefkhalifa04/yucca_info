
import json
import threading
import time
import random
import serial
import time


from integration.supabase import supabase
latest_data = {}  # Shared in-memory data
use_simulation = False  # Will become True if serial connection fails

connected = False

def simulate_data():
    
    
    temp = round(random.uniform(30.0, 38.0), 2)
    hum = round(random.uniform(50.0, 60.0), 2)
    latest = {
        "temperature": temp,
        "humidity": hum
    }
   
    return latest

def read_serial(port='COM3', baudrate=9600):
    global latest_data, use_simulation, connected

    try:
        ser = serial.Serial(port, baudrate, timeout=2)
       
        print(f"\033[92m[INFO] Connected to serial port: {port}\n\033[0m")
        connected = True
        while True:
            line = ser.readline().decode('utf-8').strip()
            try:
                temperature, humidity = line.split("|")
                latest_data = {
                    "temperature": float(temperature),
                    "humidity": float(humidity)
                }
            except ValueError:
     
                print("\033[93mInvalid data format from serial:\n\033[0m")


    except serial.SerialException as e:
      
        print(f"\033[93m[WARN] Serial connection failed: {e}\n\033[0m")
        use_simulation = True
        print("Serial connection failed. Do you want to switch to simulated data? (yes/no): ")
        user_response = input().strip().lower()
        while not  user_response : 
            time.sleep(10)
            user_response = input().strip().lower()
        if user_response == "yes":
            connected = True
            print("[INFO] Switching to simulated data.\n")
            while True:
                latest_data = simulate_data()
                time.sleep(4)
        else:
            print("[INFO] Exiting...\n")
            user_response = 'no'
            return


   


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



