
from flask import Flask, request, jsonify
from utils.serial_reader import save_data_to_supabase, get_latest_data, start_serial_reader
from utils.controller import active_motor, stop_motor, active_heater, stop_heater, active_fan, stop_fan 
import threading
import time

app = Flask(__name__)
saved_settings = {}
port = None
baudrate = None
tst = True
def background_serial_task():
    global port, baudrate, tst
    
    
    print(f"Starting serial reader with port: {port}, baudrate: {baudrate}")
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
                print("No valid sensor data yet, skipping insert.")
        except Exception as e:
            print(f"Error while saving to Supabase: {e}")
        
        time.sleep(4)

# Start the background thread
   

@app.route('/api/settings', methods=['POST'])
def save_settings():
    global saved_settings , port , baudrate
    settings = request.get_json()
    saved_settings = settings
    port = settings.get('serialPort')
    
    baudrate = settings.get('baudRate')
    print(port , baudrate)
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
        print("Motor active")
    elif action == 'stop':
        stop_motor()
        print("Motor stop")
    return jsonify({'message': 'Motor action handled'}), 200

@app.route('/handle_heater_action', methods=['POST'])
def heater_action():
    data = request.json
    action = data.get('action')
    if action == 'active':
        active_heater()
    elif action == 'stop':
        stop_heater()
    return jsonify({'message': 'Heater action handled'}), 200
@app.route('/handle_fan_action', methods=['POST'])
def fan_action():
    data = request.json
    action = data.get('action')
    if action == 'active':
        active_fan()
    elif action == 'stop':
        stop_fan()
    return jsonify({'message': 'Fan action handled'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
