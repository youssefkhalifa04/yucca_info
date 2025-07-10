from flask import Flask, jsonify
from flask_cors import CORS
from routes.api import api  # Import the API blueprint
from utils.serial_reader import start_serial_reader  # Start the ESP32 serial listener

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

# Register custom API routes
app.register_blueprint(api)

@app.route("/")
def hello():
    print("hello from flask")
    return "hello from flask"
    print("Available routes:")
    print(app.url_map)

if __name__ == '__main__':
    # Start serial reader in background thread
    start_serial_reader()
    app.run(debug=True, port=5000)
