
from flask import Blueprint, jsonify
from utils.serial_reader import get_latest_data

api = Blueprint('api', __name__)

@api.route('/api/data')
def get_data():
    data = get_latest_data()
    if not data:
        return jsonify({"error": "No data received yet"}), 204
    return jsonify(data)
