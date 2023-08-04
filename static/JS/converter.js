window.addEventListener('DOMContentLoaded', (event) => {
    fillDropdown("hourDropdown", 0, 23);
    fillDropdown("minuteDropdown", 0, 59);
    fillDropdown("secondDropdown", 0, 59);
    updateCurrentEpochTime();
    setInterval(updateCurrentEpochTime, 1000);
});

function updateCurrentEpochTime() {
    var now = new Date();
    var epochTime = Math.floor(now.getTime() / 1000);
    document.getElementById("epochTime").textContent = epochTime;
    console.log("Updated current epoch time.");
}

function performOperation() {
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

    document.getElementById("addSubtractResult").textContent = "Resulting Epoch Time: " + newEpochTime;
    displaySuccess("Operation successful!");
}

function toggleCustomTime() {
    var toggle = document.getElementById("customTimeToggle");
    document.getElementById("customHour").disabled = !toggle.checked;
    document.getElementById("customMinute").disabled = !toggle.checked;
    document.getElementById("customSecond").disabled = !toggle.checked;
}

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

    var timeZoneOffsetMinutes = selectedDate.getTimezoneOffset();
    var timeZoneOffsetHours = timeZoneOffsetMinutes / 60;

    var debugInfo = "Selected Date: " + selectedDate + "\n" +
                    "Time Zone Offset (minutes): " + timeZoneOffsetMinutes + "\n" +
                    "Time Zone Offset (hours): " + timeZoneOffsetHours + "\n" +
                    "Use GMT: " + useGMT;

    console.log(debugInfo);

    var epochTime = selectedDate.getTime() / 1000;

    if (useGMT) {
        epochTime -= timeZoneOffsetMinutes * 60; // Adjust to GMT by subtracting the offset
    }
    
    document.getElementById("calendarDateToEpochResult").textContent = "Epoch time: " + epochTime;    
    displaySuccess("Conversion successful!");
}

function convertDropdownDateToEpoch() {
    // Implement functionality for converting dropdown date to epoch
}

function convertTimeZone() {
    // Implement functionality for converting between time zones
}

function convertEpochToHumanReadable() {
    var epochTime = parseInt(document.getElementById("epochInput").value, 10);
    if (isNaN(epochTime)) {
        displayError("Please enter a valid epoch time.");
        return;
    }

    var humanReadableDate = new Date(epochTime * 1000).toLocaleString();
    document.getElementById("epochToHumanResult").textContent = "Human-readable date: " + humanReadableDate;
    displaySuccess("Conversion successful!");
}

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

function displayError(message) {
    document.getElementById("errorMessage").textContent = message;
}

function displaySuccess(message) {
    document.getElementById("successMessage").textContent = message;
}

function clearMessages() {
    document.getElementById("errorMessage").textContent = "";
    document.getElementById("successMessage").textContent = "";
}

document.getElementById("epochType").addEventListener("change", function () {
    document.getElementById("specificEpochInput").disabled = this.value !== "specific";
});
