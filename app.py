from flask import Flask, render_template, request
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    epoch_time = None
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

    if request.method == "POST" and error_message is None:
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

    return render_template(
        "index.html",
        current_epoch_time=int(current_epoch_time.timestamp()),
        time_to_add=int(time_to_add),
        time_to_add_explanation=time_to_add_explanation,
        epoch_time=epoch_time,
        form_data=form_data,
        new_epoch_time=int(new_epoch_time.timestamp() if new_epoch_time is not None else 0),
        error_message=error_message,
    )

if __name__ == '__main__':
    app.run(debug=True)
