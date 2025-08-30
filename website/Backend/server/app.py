
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.serial_reader import save_data_to_supabase, get_latest_data, start_serial_reader
from utils.controller import active_motor, stop_motor, active_heater, stop_heater, active_fan, stop_fan 
from utils.auto import auto
import utils.serial_reader as serial_reader
import threading
import time
import aiohttp
import asyncio
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
saved_settings = {}
current_egg_type = None
port = None
baudrate = None
connectionType = None
tst = True

auto_thread = None
auto_stop_event = None

async def fetch_url():
    async with aiohttp.ClientSession() as session:
        async with session.get("http://localhost:5001/sensor") as response:
            return await response.json()
async def fetch_loop():
    while True:
        try:
            data = await fetch_url()
            print(f"\033[96mHTTP Data: {data}\033[0m")
            save_data_to_supabase(data)
        except Exception as e:
            print(f"\033[91mHTTP fetch error: {e}\033[0m")
        await asyncio.sleep(4)


def background_serial_task():
    global port, baudrate, connectionType, tst
    handle_autoMode('start')
    if connectionType == 'serial':
       
        print(f"\033[92mStarting serial reader with port: {port}, baudrate: {baudrate}\033[0m")
        start_serial_reader(port=port, baudrate=baudrate)

        while True:
            try:
                data = get_latest_data() 
                print(data)  # For debugging
                temp = data.get('temperature')
                hum = data.get('humidity')
                if temp is not None and hum is not None: 
                    save_data_to_supabase(data)
                else:
                    time.sleep(4)  # Wait before trying again
            except Exception as e:
                print(f"\033[91mError while saving to Supabase: {e}\033[0m")

            time.sleep(4)
    else : 
        print("\033[94mStarting background task for HTTP connection\033[0m")
        asyncio.run(fetch_loop())

def handle_autoMode(action) :
    global auto_thread, auto_stop_event
    if action == "start":
        if auto_thread and auto_thread.is_alive():
            return
        auto_stop_event = threading.Event()
        auto_thread = threading.Thread(target=lambda: asyncio.run(auto(current_egg_type,port, baudrate, stop_event=auto_stop_event)) , daemon=True)
        auto_thread.start()
    else :
        if auto_stop_event:
            auto_stop_event.set()
        if auto_thread:
            auto_thread.join(timeout=2)

def start_manual() : 
    pass

@app.route('/api/controlMode' , methods  = ['POST'])
def controlMode():
    body = request.get_json(silent=True) or {}
    if isinstance(body, str):
        data = body
    else:
        data = body.get('controlMode') or body.get('controleMode') or body
    
    while not serial_reader.connected : 
        time.sleep(5)
    print('connected')
    
    if data == 'automatic' : 

        print('\033[94mstarting auto mode\033[0m')
        handle_autoMode("start")
    
    else : 
        print('\033[92mstarting manual mode\033[0m')
        handle_autoMode("stop")
        start_manual()
    return jsonify({"mode": data or "unknown"}), 200

@app.route('/api/settings', methods=['POST'])
def save_settings():
    global saved_settings , port , baudrate , connectionType
    settings = request.get_json()
    saved_settings = settings
    port = settings.get('serialPort')
    connectionType = settings.get('connectionType')
    baudrate = settings.get('baudRate')
    serial_thread = threading.Thread(target=background_serial_task, daemon=True)
    serial_thread.start()
    return jsonify({"message": "Settings saved successfully", "settings": saved_settings})

@app.route('/api/status', methods=['GET'])
def check_status():
    global port, baudrate, tst
    if tst:
        # Check if we're using simulation mode
        from utils.serial_reader import use_simulation
        if use_simulation:
            return jsonify({"status": "Connected (Simulation Mode)", "mode": "simulation"})
        else:
            return jsonify({"status": "Connected", "mode": "real", "port": port, "baudrate": baudrate})
    else:
        return jsonify({"status": "Disconnected", "error": "Serial connection not established"})

    
@app.route('/handle_motor_action', methods=['POST'])
def motor_action():
    data = request.json
    action = data.get('action')
    if action == 'active':
        active_motor()
        
        print("\033[93mMotor active\033[0m")
    elif action == 'stop':
        stop_motor()
        print("\033[91mMotor stop\033[0m")
    return jsonify({'message': 'Motor action handled'}), 200

@app.route('/handle_heater_action', methods=['POST'])
def heater_action():
    data = request.json
    action = data.get('action')
    if action == 'active':
        active_heater()
        print("\033[93mHeater active\033[0m")
    elif action == 'stop':
        stop_heater()
        print("\033[91mHeater stop\033[0m")
    return jsonify({'message': 'Heater action handled'}), 200

current_egg_type = 'chicken'

@app.route('/api/EggType' , methods=['POST'])
def getEgg (): 
    global current_egg_type
    data = request.get_json()
    
    current_egg_type = data.get('id')
    print(f"\033[94mNew egg selected \033[92m{current_egg_type}\033[0m")
    return jsonify({"message": "Egg type received", "egg": current_egg_type}), 200

@app.route('/api/EggType' , methods=['GET'])
def readEgg ():
    return jsonify({"egg": current_egg_type}), 200

    
@app.route('/handle_fan_action', methods=['POST'])
def fan_action():
    data = request.json
    action = data.get('action')
    if action == 'active':
        active_fan()
        print("\033[93mFan active\033[0m")
    elif action == 'stop':
        stop_fan()
        print("\033[91mFan stop\033[0m")
    return jsonify({'message': 'Fan action handled'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
