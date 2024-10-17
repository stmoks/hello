from flask import Blueprint, render_template, request, jsonify
import polars as pl
from app.database import get_db_uri

bp = Blueprint('pages', __name__)

@bp.route('/', methods=['GET'])
def home():
    db_uri = get_db_uri()
    country_info = pl.read_database_uri('SELECT city FROM reference.country_info', db_uri)
    cities = country_info.select(pl.col('city').sort()).to_series().to_list()
    return render_template('pages/index.html', cities=cities)

@bp.route('/submit-capital', methods=['POST'])
def submit_capital():
    db_uri = get_db_uri()
    country_info = pl.read_database_uri('SELECT * FROM reference.country_info', db_uri)

    if request.method == 'POST':
        city = request.form.get('capital')
        try:
            
            country_data = country_info.filter(pl.col('city') == city).select(pl.all().exclude(['coords_city_sdc','flag'])).to_dict(as_series=False)
            if country_data:
                # Convert to regular Python types for JSON serialization
                result = {k: v[0] for k, v in country_data.items()}
                print("Sending data:", result)  # Debug print
                return jsonify(result)
            else:
                return jsonify({'error': 'City not found'}), 404
        except Exception as e:
            print(f"Error processing request: {e}")  # Debug print
            return jsonify({'error': 'Server error'}), 500

    return jsonify({'error': 'Invalid request'}), 400