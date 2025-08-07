
import json
import threading
import time
import random
import serial
import time


from integration.supabase import supabase
latest_data = {}  # Shared in-memory data
use_simulation = False  # Will become True if serial connection fails

def test_serial_connection(port='COM3', baudrate=9600, timeout=2):
    """
    Test if a serial connection can be established with the given port and baudrate.
    
    Args:
        port (str): Serial port to test (e.g., 'COM3', '/dev/ttyUSB0')
        baudrate (int): Baudrate to test (e.g., 9600, 115200)
        timeout (int): Connection timeout in seconds
    
    Returns:
        dict: {
            'success': bool,
            'message': str,
            'port': str,
            'baudrate': int,
            'error': str or None
        }
    """
    result = {
        'success': False,
        'message': '',
        'port': port,
        'baudrate': baudrate,
        'error': None
    }
    
    try:
        print(f"[TEST] Testing serial connection on {port} at {baudrate} baud...")
        
        # Attempt to open the serial connection
        ser = serial.Serial(port, baudrate, timeout=timeout)
        
        # Test if the port is actually open
        if ser.is_open:
            print(f"[TEST] Successfully connected to {port} at {baudrate} baud")
            result['success'] = True
            result['message'] = f"Successfully connected to {port} at {baudrate} baud"
            
            # Optional: Try to read a line to test communication
            try:
                ser.write(b'TEST\n')  # Send a test command
                time.sleep(0.1)  # Give device time to respond
                response = ser.readline().decode('utf-8').strip()
                if response:
                    print(f"[TEST] Device responded: {response}")
                    result['message'] += f" - Device responded: {response}"
                else:
                    print(f"[TEST] Device connected but no response to test command")
                    result['message'] += " - Device connected but no response"
            except Exception as comm_error:
                print(f"[TEST] Connected but communication test failed: {comm_error}")
                result['message'] += f" - Communication test failed: {comm_error}"
            
            # Close the connection after testing
            ser.close()
            print(f"[TEST] Connection test completed, port closed")
            
        else:
            result['error'] = "Port opened but not accessible"
            result['message'] = f"Failed to access {port}"
            print(f"[TEST] Port {port} opened but not accessible")
            
    except serial.SerialException as e:
        result['error'] = str(e)
        result['message'] = f"Serial connection failed: {e}"
        print(f"[TEST] Serial connection failed on {port}: {e}")
        
    except Exception as e:
        result['error'] = str(e)
        result['message'] = f"Unexpected error: {e}"
        print(f"[TEST] Unexpected error testing {port}: {e}")
    
    return result

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



