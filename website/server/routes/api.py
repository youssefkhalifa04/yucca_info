import os
import json
from flask import Blueprint, jsonify

api = Blueprint('api', __name__)

@api.route('/api/data')
def get_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))  # .../server/routes
    file_path = os.path.abspath(os.path.join(base_dir, '..', 'data', 'data.json'))

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
    except Exception as e:
        return jsonify({"error": f"Could not read or parse file: {str(e)}"}), 500

    return jsonify({"temperature": 25, "humidity": 60})
