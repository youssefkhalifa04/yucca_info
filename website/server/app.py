
from flask import Flask, jsonify
from flask_cors import CORS
from routes.api import api
from utils.serial_reader import start_serial_reader

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    # Register API blueprint
    app.register_blueprint(api)

    @app.route("/")
    def hello():
        print("Hello from Flask")
        return "Hello from Flask"

    return app

if __name__ == '__main__':
    # Start the serial reading thread
    start_serial_reader()

    # Launch the Flask server
    app = create_app()
    app.run(debug=True, port=5000)
