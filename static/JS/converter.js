window.addEventListener('DOMContentLoaded', (event) => {
    const currentMonth = new Date().getMonth() + 1; // Months are 0 indexed, so we add 1
    const currentYear = new Date().getFullYear();
    fillDays(currentMonth, currentYear);
    fillHours();
    fillMinutes();
    fillSeconds();
    fillMonths();
    fillYears();
    updateCurrentEpochTime();
    setInterval(updateCurrentEpochTime, 1000);

    // Initial state setup
    toggleCustomTime(); // Call this function to set the initial state
    document.getElementById("epochType").dispatchEvent(new Event("change"));
    var today = new Date();
    var formattedDate = today.toISOString().slice(0, 10); // Converts date to 'yyyy-mm-dd' format
    document.getElementById("calendarDateToEpoch").value = formattedDate;

});


// Updates and displays the current epoch time.
function updateCurrentEpochTime() {
    var now = new Date();
    var epochTime = Math.floor(now.getTime() / 1000);
    document.getElementById("epochTime").textContent = epochTime;
    console.log("Updated current epoch time.");
}

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

function toggleCustomTime() {
    var toggle = document.getElementById("customTimeToggle").checked;
    console.log('Custom Time Toggle:', toggle);
    var displayValue = toggle ? "inline" : "none";

    // Set the display value for custom time inputs
    document.getElementById("customHour").style.display = displayValue;
    document.getElementById("customMinute").style.display = displayValue;
    document.getElementById("customSecond").style.display = displayValue;

    // Set the display value for 12AM/12PM checkboxes
    document.getElementById("time12AMCal").style.display = toggle ? "none" : "inline";
    document.getElementById("time12PMCal").style.display = toggle ? "none" : "inline";

    // Set the disabled property for custom time inputs
    document.getElementById("customHour").disabled = !toggle;
    document.getElementById("customMinute").disabled = !toggle;
    document.getElementById("customSecond").disabled = !toggle;
}



function presetTime(checkboxElement) {
    console.log('Preset Time triggered for:', checkboxElement.id, 'Checked Status:', checkboxElement.checked);

    var is12AM = checkboxElement.id === "time12AMCal";
    var is12PM = checkboxElement.id === "time12PMCal";

    if (is12AM && checkboxElement.checked) {
        console.log('Setting time to 12 AM.');
        document.getElementById("customHour").value = 0;
        document.getElementById("customMinute").value = 0;
        document.getElementById("customSecond").value = 0;
        document.getElementById("time12PMCal").checked = false; // uncheck the other checkbox
    } else if (is12PM && checkboxElement.checked) {
        console.log('Setting time to 12 PM.');
        document.getElementById("customHour").value = 12;
        document.getElementById("customMinute").value = 0;
        document.getElementById("customSecond").value = 0;
        document.getElementById("time12AMCal").checked = false; // uncheck the other checkbox
    }

    return 'Function executed';

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