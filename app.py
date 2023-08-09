from flask import Flask, render_template, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__, static_url_path='', static_folder='static')

def process_date_to_epoch(date_time):
    epoch_time = int(date_time.timestamp())
    return epoch_time

def process_epoch_calculator(weeks, days, hours, minutes, seconds):
    error_message = None
    time_to_add = 0
    try:
        # Validate number of days
        if days > 999999999:
            raise OverflowError("Number of days must be less than or equal to 999,999,999")

        time_to_add = timedelta(
            weeks=weeks, days=days, hours=hours, minutes=minutes, seconds=seconds
        ).total_seconds()
    except OverflowError as oe:
        error_message = str(oe)

    explanation_parts = []
    if weeks > 0:
        explanation_parts.append(f"{weeks} week(s) * 7d * 24h * 60m * 60s")
    if days > 0:
        explanation_parts.append(f"{days} day(s) * 24h * 60m * 60s")
    if hours > 0:
        explanation_parts.append(f"{hours} hour(s) * 60m * 60s")
    if minutes > 0:
        explanation_parts.append(f"{minutes} minute(s) * 60s")

    time_to_add_explanation = " + ".join(explanation_parts)

    current_epoch_time = datetime.utcnow()
    new_epoch_time = None
    try:
        new_epoch_time = current_epoch_time + timedelta(seconds=time_to_add)
    except OverflowError as oe:
        error_message = str(oe)

    if error_message is not None:
        return None, 0, "", None, "An error occurred while processing the request"

    return current_epoch_time, time_to_add, time_to_add_explanation, new_epoch_time, error_message

def process_calendar_date_to_epoch(date_input):
    year, month, day = map(int, date_input.split('-'))
    date_time = datetime(year, month, day)
    epoch_time = int(date_time.timestamp())
    return epoch_time

@app.route('/robots.txt', methods=['GET'])
def sitemap():
    return app.send_static_file('robots.txt')

@app.route('/sitemap.xml', methods=['GET'])
def sitemap():
    return app.send_static_file('sitemap.xml')

@app.route('/convert-date-to-epoch', methods=['POST'])
def convert_date_to_epoch():
    date_time = request.json['date']
    epoch_time = process_date_to_epoch(datetime.fromisoformat(date_time))
    return jsonify(epoch_time=epoch_time)

@app.route('/convert-calendar-date-to-epoch', methods=['POST'])
def convert_calendar_date_to_epoch():
    date_input = request.json['calendar_date']
    epoch_time = process_calendar_date_to_epoch(date_input)
    return jsonify(epoch_time=epoch_time)

@app.route('/process-epoch-calculator', methods=['POST'])
def process_epoch_calculator_view():
    weeks = request.json.get("weeks", 0)
    days = request.json.get("days", 0)
    hours = request.json.get("hours", 0)
    minutes = request.json.get("minutes", 0)
    seconds = request.json.get("seconds", 0)

    current_epoch_time, time_to_add, time_to_add_explanation, new_epoch_time, error_message = process_epoch_calculator(weeks, days, hours, minutes, seconds)
    return jsonify(current_epoch_time=int(current_epoch_time.timestamp()) if current_epoch_time else None,
                   time_to_add=int(time_to_add),
                   time_to_add_explanation=time_to_add_explanation,
                   new_epoch_time=int(new_epoch_time.timestamp()) if new_epoch_time else None,
                   error_message=error_message)

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)  # Change this to False for production
