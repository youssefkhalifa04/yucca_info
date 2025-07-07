from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes


@app.route("/")
def hello():
    print("hello from flask")  # This prints to the terminal
    return "hello from flask"
if __name__ == '__main__':
    app.run(debug=True, port=5000)
