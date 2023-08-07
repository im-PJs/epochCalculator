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
        document.getElementById("time12PM").checked = false; // uncheck the other checkbox
    } else if (is12PM) {
        console.log('Setting time to 12 PM.');
        document.getElementById("customHour").value = 12;
        document.getElementById("customMinute").value = 0;
        document.getElementById("customSecond").value = 0;
        document.getElementById("time12AM").checked = false; // uncheck the other checkbox
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
    if (document.getElementById("customTimeToggle").checked) {
        selectedDate.setHours(document.getElementById("customHour").value);
        selectedDate.setMinutes(document.getElementById("customMinute").value);
        selectedDate.setSeconds(document.getElementById("customSecond").value);
    }

    var epochTime = selectedDate.getTime() / 1000;
    if (useGMT) {
        var timeZoneOffsetMinutes = selectedDate.getTimezoneOffset();
        epochTime -= timeZoneOffsetMinutes * 60; // Adjust to GMT by subtracting the offset
    }
    
    document.getElementById("calendarDateToEpochResult").textContent = "Epoch time: " + epochTime;    
    displaySuccess("Conversion successful!");
}

function fillMonths() {
    const dropdown = document.getElementById("monthDropdown");
    const currentMonth = new Date().getMonth();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    months.forEach((month, index) => {
        let option = document.createElement("option");
        option.text = month;
        option.value = index + 1;
        if (index === currentMonth) option.selected = true; // Set current month as default
        dropdown.add(option);
    });
}

function fillMinutes() {
        const dropdown = document.getElementById("minuteDropdown");
        const currentMinute = new Date().getMinutes();
        
    
        for (let i = 0; i <= 59; i++) {
            let option = document.createElement("option");
            option.text = i.toString();
            option.value = i;
            if (i === currentMinute) option.selected = true; // Set current year as default
            dropdown.add(option);
        }
    }

function fillSeconds() {
    const dropdown = document.getElementById("secondDropdown");
    const currentSeconds = new Date().getSeconds();
    

    for (let i = 0; i <= 59; i++) {
        let option = document.createElement("option");
        option.text = i.toString();
        option.value = i;
        if (i === currentSeconds) option.selected = true; // Set current year as default
        dropdown.add(option);
    }
}

function fillHours() {
    const dropdown = document.getElementById("hourDropdown");
    const currentHour = new Date().getHours();
    

    for (let i = 0; i <= 23; i++) {
        let option = document.createElement("option");
        option.text = i.toString();
        option.value = i;
        if (i === currentHour) option.selected = true; // Set current year as default
        dropdown.add(option);
    }
}

function fillYears() {
    const dropdown = document.getElementById("yearDropdown");
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 50;
    const endYear = currentYear;
    for (let i = startYear; i <= endYear; i++) {
        let option = document.createElement("option");
        option.text = i.toString();
        option.value = i;
        if (i === currentYear) option.selected = true; // Set current year as default
        dropdown.add(option);
    }
}

function fillDays(month, year) {
    const dropdown = document.getElementById("dayDropdown");
    const currentDay = new Date().getDate();  // Get the current day

    // Clear previous options
    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }

    let daysInMonth = new Date(year, month, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        let option = document.createElement("option");
        option.text = i.toString().padStart(2, '0');
        option.value = i;
        if (i === currentDay) option.selected = true; // Set current day as default
        dropdown.add(option);
    }
}


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


// Toggles between dark and light themes.
function toggleTheme() {
    var element = document.body;
    if (element.classList.contains("dark-mode")) {
        element.classList.remove("dark-mode");
        element.classList.add("light-mode");
    } else {
        element.classList.remove("light-mode");
        element.classList.add("dark-mode");
    }
}

// Displays an error message.
function displayError(message) {
    document.getElementById("errorMessage").textContent = message;
}

// Displays a success message.
function displaySuccess(message) {
    document.getElementById("successMessage").textContent = message;
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

    switch (timeUnit) {
        case "minutes": timeValue *= 60; break;
        case "hours": timeValue *= 3600; break;
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

    // Display the original time, the amount of seconds to add, and then the output time
    var resultText = "Original Epoch Time: " + Math.round(currentEpoch) + "<br>";
    resultText += "Amount of seconds to " + (operationType === "add" ? "add: " : "subtract: ") + timeValue + " Seconds<br>";
    resultText += "Resulting Epoch Time: " + Math.round(newEpochTime);

    document.getElementById("addSubtractResult").innerHTML = resultText;
    displaySuccess("Operation successful!");
}

// Clears all messages.
function clearMessages() {
    document.getElementById("errorMessage").textContent = "";
    document.getElementById("successMessage").textContent = "";
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

document.getElementById("monthDropdown").addEventListener("change", function() {
    const month = parseInt(this.value, 10);
    const year = parseInt(document.getElementById("yearDropdown").value, 10);
    fillDays(month, year);
});

document.getElementById("yearDropdown").addEventListener("change", function() {
    const year = parseInt(this.value, 10);
    const month = parseInt(document.getElementById("monthDropdown").value, 10);
    fillDays(month, year);
});
