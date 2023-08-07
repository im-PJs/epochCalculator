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
