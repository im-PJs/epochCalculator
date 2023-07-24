from flask import Flask, render_template, request
from datetime import datetime, timedelta

app = Flask(__name__)

def process_date_to_epoch(request, form_data):
    """Processes the date to epoch conversion.

    Args:
        request: The Flask request object.
        form_data: A dictionary to store form data.

    Returns:
        epoch_time: The calculated epoch time.
        error_message: Any error messages that occurred during processing.
    """
    epoch_time = None
    error_message = None
    try:
        form_data["year"] = year = int(request.form.get("year", form_data["year"]))
        form_data["month"] = month = int(request.form.get("month", form_data["month"]))
        form_data["day"] = day = int(request.form.get("day", form_data["day"]))
        form_data["hour"] = hour = int(request.form.get("hour", form_data["hour"]))
        form_data["minute"] = minute = int(request.form.get("minute", form_data["minute"]))
        form_data["second"] = second = int(request.form.get("second", form_data["second"]))
        form_data["hour_format"] = hour_format = request.form.get("hour_format", "12")
        form_data["am_pm"] = am_pm = request.form.get("am_pm", "AM")

        if hour_format == "12":
            if am_pm == "PM" and hour != 12:
                hour += 12
            elif am_pm == "AM" and hour == 12:
                hour = 0

        date_time = datetime(year, month, day, hour, minute, second)
        epoch_time = int(date_time.timestamp())
    except Exception as e:
        error_message = str(e)

    return epoch_time, error_message

def process_epoch_calculator(request):
    """Processes the epoch calculator.

    Args:
        request: The Flask request object.

    Returns:
        current_epoch_time: The current epoch time.
        time_to_add: The total seconds to be added to the current epoch time.
        time_to_add_explanation: The explanation of the total seconds.
        new_epoch_time: The new epoch time after addition.
        error_message: Any error messages that occurred during processing.
    """
    error_message = None
    time_to_add = 0
    try:
        weeks = request.form.get("weeks", type=int, default=0)
        days = request.form.get("days", type=int, default=0)
        hours = request.form.get("hours", type=int, default=0)
        minutes = request.form.get("minutes", type=int, default=0)
        seconds = request.form.get("seconds", type=int, default=0)

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

    return current_epoch_time, time_to_add, time_to_add_explanation, new_epoch_time, error_message

def process_calendar_date_to_epoch(request):
    """Processes the calendar date to epoch conversion.

    Args:
        request: The Flask request object.

    Returns:
        epoch_time: The calculated epoch time.
        error_message: Any error messages that occurred during processing.
    """
    epoch_time = None
    error_message = None
    try:
        date_input = request.form.get("calendar-date", None)
        if date_input:
            # Input format is 'YYYY-MM-DD'
            year, month, day = map(int, date_input.split('-'))
            date_time = datetime(year, month, day)  # Time is assumed to be 00:00:00
            epoch_time = int(date_time.timestamp())
    except Exception as e:
        error_message = str(e)

    return epoch_time, error_message

@app.route('/', methods=['GET', 'POST'])
def index():
    form_data = {
        "year": datetime.utcnow().year,
        "month": datetime.utcnow().month,
        "day": datetime.utcnow().day,
        "hour": datetime.utcnow().hour,
        "minute": datetime.utcnow().minute,
        "second": datetime.utcnow().second,
        "hour_format": "12",
        "am_pm": "AM",
    }

    if request.method == 'POST':
        epoch_time, error_message_date_to_epoch = process_date_to_epoch(request, form_data)
        current_epoch_time, time_to_add, time_to_add_explanation, new_epoch_time, error_message_epoch_calculator = process_epoch_calculator(request)
        calendar_epoch_time, error_message_calendar_date_to_epoch = process_calendar_date_to_epoch(request)
    else:
        epoch_time = error_message_date_to_epoch = current_epoch_time = time_to_add = time_to_add_explanation = new_epoch_time = error_message_epoch_calculator = None
        calendar_epoch_time = error_message_calendar_date_to_epoch = None


    # Combine the error messages if there are any
    error_message = error_message_date_to_epoch or error_message_epoch_calculator or error_message_calendar_date_to_epoch

    return render_template(
        "index.html",
        epoch_time=epoch_time,
        form_data=form_data,
        current_epoch_time=int(current_epoch_time.timestamp() if current_epoch_time is not None else 0),
        time_to_add=int(time_to_add),
        time_to_add_explanation=time_to_add_explanation,
        new_epoch_time=int(new_epoch_time.timestamp() if new_epoch_time is not None else 0),
        calendar_epoch_time=calendar_epoch_time,
        error_message=error_message,
    )

if __name__ == '__main__':
    app.run(debug=True)
