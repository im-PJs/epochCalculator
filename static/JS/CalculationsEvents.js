// Fills dropdown with numbers in a given range.
function fillDropdown(id, start, end) {
    var dropdown = document.getElementById(id);
    for (let i = start; i <= end; i++) {
        let option = document.createElement("option");
        option.text = i.toString().padStart(2, '0');
        option.value = i;
        dropdown.add(option);
    }
    console.log(`Filled dropdown ${id} from ${start} to ${end}.`);
}

function addSubtractCalc() {
    var operationType = document.getElementById("operation").value;
    var timeValue = parseInt(document.getElementById("timeValue").value, 10);
    var timeUnit = document.getElementById("timeUnit").value;
    var epochType = document.getElementById("epochType").value;
    var specificEpoch = epochType === "specific" ? parseInt(document.getElementById("specificEpochInput").value, 10) : null;

    if (isNaN(timeValue) || (specificEpoch !== null && isNaN(specificEpoch))) {
        displayError("Please enter valid numeric values.");
        return;
    }

    var timeUnitConversion = "";
    var originalTimeValue = timeValue; // Store the original time value for later reference

    switch (timeUnit) {
        case "minutes": 
            timeValue *= 60; 
            timeUnitConversion = "(" + originalTimeValue + " minutes x 60 sec)";
            break;
        case "hours": 
            timeValue *= 3600; 
            timeUnitConversion = "(" + originalTimeValue + " hours x 3600 sec)";
            break;
        case "days": 
            timeValue *= 86400; 
            timeUnitConversion = "(" + originalTimeValue + " days x 86400 sec)";
            break;
        case "weeks": 
            timeValue *= 604800; 
            timeUnitConversion = "(" + originalTimeValue + " weeks x 604800 sec)";
            break;
    }    

    var currentEpoch = new Date().getTime() / 1000;

    if (epochType === "specific") {
        currentEpoch = specificEpoch;
    }

    var newEpochTime = operationType === "add" ? currentEpoch + timeValue : currentEpoch - timeValue;

    if (newEpochTime < 0) {
        displayError("Subtraction resulted in a negative epoch time.");
        return;
    }

    // Display the original time, the amount of seconds to add, the breakdown of the seconds calculation, and then the output time
    var resultText = "Original Epoch Time: " + Math.round(currentEpoch) + "<br>";
    resultText += "Amount of seconds to " + (operationType === "add" ? "add: " : "subtract: ") + timeValue + " Seconds " + timeUnitConversion + "<br>";
    resultText += "Resulting Epoch Time: " + Math.round(newEpochTime);

    document.getElementById("addSubtractResult").innerHTML = resultText;
    displaySuccess("Operation successful!");
}

// Shows or hides the specific epoch input based on the selection.
document.getElementById("customTimeToggle").addEventListener("change", function () {
    if (this.checked) {
        document.getElementById("ampmCheck").style.display = 'none';  // show it
    } else {
        document.getElementById("ampmCheck").style.display = 'inline-block';  // hide it
    }
});

// Shows or hides the specific epoch input based on the selection.
document.getElementById("epochType").addEventListener("change", function () {
    if (this.value === "specific") {
        document.getElementById("specificEpochInput").style.display = 'inline-block';  // show it
    } else {
        document.getElementById("specificEpochInput").style.display = 'none';  // hide it
    }
});

// Enables or disables the specific epoch input based on the selection.
document.getElementById("epochType").addEventListener("change", function () {
    document.getElementById("specificEpochInput").disabled = this.value !== "specific";
});




// Converts the selected date from dropdowns to epoch time.
function convertDropdownDateToEpoch() {
    var year = parseInt(document.getElementById("yearDropdown").value, 10);
    var month = parseInt(document.getElementById("monthDropdown").value, 10) - 1; // JavaScript months are 0-indexed
    var day = parseInt(document.getElementById("dayDropdown").value, 10);
    var hour = parseInt(document.getElementById("hourDropdown").value, 10);
    var minute = parseInt(document.getElementById("minuteDropdown").value, 10);
    var second = parseInt(document.getElementById("secondDropdown").value, 10);

    var selectedDate = new Date(year, month, day, hour, minute, second);
    var epochTime = selectedDate.getTime() / 1000;

    document.getElementById("dropdownDateToEpochResult").textContent = "Epoch time: " + epochTime;
    displaySuccess("Dropdown date to epoch conversion successful!");
}

// Converts the epoch time to another timezone based on the selected offset.
function convertTimeZone() {
    var currentEpoch = parseInt(document.getElementById("epochTime").textContent, 10);
    var timeZoneOffset = parseInt(document.getElementById("timeZoneDropdown").value, 10);

    var adjustedEpoch = currentEpoch + (timeZoneOffset * 60); // Assume the dropdown gives the offset in minutes.

    document.getElementById("convertedTimeZoneResult").textContent = "Adjusted Epoch for Time Zone: " + adjustedEpoch;
    displaySuccess("Timezone conversion successful!");
}

// Converts an epoch time to a human-readable date.
function convertEpochToHumanReadable() {
    var epochTime = parseInt(document.getElementById("epochInput").value, 10);
    var useGMT = document.getElementById("epochToHumanUseGMT").checked;

    if (isNaN(epochTime)) {
        displayError("Please enter a valid epoch time.");
        return;
    }

    var dateObj = new Date(epochTime * 1000);
    
    var gmtString = "GMT: " + dateObj.toUTCString();

    var options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        timeZoneName: 'short'
    };

    var localTimeString = dateObj.toLocaleString('en-US', options);

    var timeZoneOffsetMinutes = dateObj.getTimezoneOffset();
    var offsetSign = timeZoneOffsetMinutes > 0 ? "-" : "+";
    var absoluteOffset = Math.abs(timeZoneOffsetMinutes);
    var hoursOffset = Math.floor(absoluteOffset / 60);
    var minutesOffset = absoluteOffset % 60;

    var offsetString = " (GMT" + offsetSign + (hoursOffset < 10 ? "0" : "") + hoursOffset + ":" + (minutesOffset < 10 ? "0" : "") + minutesOffset + ")";
    
    var localString = "Your time zone: " + localTimeString + offsetString;

    var relativeString = "Relative: " + timeSince(epochTime * 1000);

    var resultString = useGMT ? (gmtString + "<br>" + relativeString + "<br>" + localString) : (localString + "<br>" + relativeString + "<br>" + gmtString);

    document.getElementById("epochToHumanResult").innerHTML = resultString;
    displaySuccess("Conversion successful!");
}


// Function to calculate relative time since given timestamp
function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}




// Converts a selected calendar date to epoch time.
function convertCalendarDateToEpoch() {
    var date = document.getElementById("calendarDateToEpoch").value;
    var useGMT = document.getElementById("calendarUseGMT").checked;

    if (!date) {
        displayError("Please select a valid date.");
        return;
    }

    // Parsing the date input manually
    var parts = date.split('-');
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);

    var selectedDate = new Date(year, month, day);

    // Check if the 12AM or 12PM checkboxes are selected, regardless of customTimeToggle
    var is12AMChecked = document.getElementById("time12AMCal").checked;
    var is12PMChecked = document.getElementById("time12PMCal").checked;

    var hour, minute, second;
    if (document.getElementById("customTimeToggle").checked) {
        hour = parseInt(document.getElementById("customHour").value, 10);
        minute = parseInt(document.getElementById("customMinute").value, 10);
        second = parseInt(document.getElementById("customSecond").value, 10);
    } else if (is12AMChecked) {
        hour = 0;
        minute = 0;
        second = 0;
    } else if (is12PMChecked) {
        hour = 12;
        minute = 0;
        second = 0;
    } else {
        // Default to 12AM if none of the above conditions are met
        hour = 0;
        minute = 0;
        second = 0;
    }

    selectedDate.setHours(hour);
    selectedDate.setMinutes(minute);
    selectedDate.setSeconds(second);

    var epochTime = selectedDate.getTime() / 1000;
    if (useGMT) {
        var timeZoneOffsetMinutes = selectedDate.getTimezoneOffset();
        epochTime -= timeZoneOffsetMinutes * 60; // Adjust to GMT by subtracting the offset
    }
    
    document.getElementById("calendarDateToEpochResult").textContent = "Epoch time: " + epochTime;    
    displaySuccess("Conversion successful!");
}





