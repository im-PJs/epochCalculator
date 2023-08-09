// Toggles between dark and light themes.
function toggleTheme() {
    var element = document.body;
    var checkbox = document.getElementById("toggleThemeCheckbox");
    if (element.classList.contains("dark-mode")) {
        element.classList.remove("dark-mode");
        element.classList.add("light-mode");
        checkbox.checked = false;
    } else {
        element.classList.remove("light-mode");
        element.classList.add("dark-mode");
        checkbox.checked = true;
    }
}

document.getElementById("toggleThemeCheckbox").addEventListener("change", toggleTheme);

// Displays an error message.
function displayError(message) {
    document.getElementById("errorMessage").textContent = message;
}

// Displays a success message.
function displaySuccess(message) {
    document.getElementById("successMessage").textContent = message;
}

// Clears all messages.
function clearMessages() {
    document.getElementById("errorMessage").textContent = "";
    document.getElementById("successMessage").textContent = "";
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
