function fillMonths() {
    const dropdown = document.getElementById("monthDropdown");
    const currentMonth = new Date().getMonth();
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
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
        let paddedSecond = i.toString().padStart(2, '0'); // pad the number with zeros
        option.text = paddedSecond;
        option.value = i;
        if (i === currentSeconds) option.selected = true; // Set current second as default
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

window.addEventListener('DOMContentLoaded', (event) => {
    const currentMonth = new Date().getMonth() + 1; // Months are 0 indexed, so we add 1
    const currentYear = new Date().getFullYear();
    fillDays(currentMonth, currentYear);
    fillHours();
    fillMinutes();
    fillSeconds();
    updateTitle();
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

