function fillDropdown(e, t, n) {
    var o = document.getElementById(e);
    for (let l = t; l <= n; l++) {
        let a = document.createElement("option");
        (a.text = l.toString().padStart(2, "0")), (a.value = l), o.add(a);
    }
    console.log(`Filled dropdown ${e} from ${t} to ${n}.`);
}
function addSubtractCalc() {
    var e = document.getElementById("operation").value,
        t = parseInt(document.getElementById("timeValue").value, 10),
        n = document.getElementById("timeUnit").value,
        o = document.getElementById("epochType").value,
        l = "specific" === o ? parseInt(document.getElementById("specificEpochInput").value, 10) : null;
    if (isNaN(t) || (null !== l && isNaN(l))) {
        displayError("Please enter valid numeric values.");
        return;
    }
    var a = "",
        c = t;
    switch (n) {
        case "minutes":
            (t *= 60), (a = "(" + c + " minutes x 60 sec)");
            break;
        case "hours":
            (t *= 3600), (a = "(" + c + " hours x 3600 sec)");
            break;
        case "days":
            (t *= 86400), (a = "(" + c + " days x 86400 sec)");
            break;
        case "weeks":
            (t *= 604800), (a = "(" + c + " weeks x 604800 sec)");
    }
    var i = new Date().getTime() / 1e3;
    "specific" === o && (i = l);
    var d = "add" === e ? i + t : i - t;
    if (d < 0) {
        displayError("Subtraction resulted in a negative epoch time.");
        return;
    }
    var r = "Original Epoch Time: " + Math.round(i) + "<br>";
    (r += "Amount of seconds to " + ("add" === e ? "add: " : "subtract: ") + t + " Seconds " + a + "<br>"),
        (r += "Resulting Epoch Time: " + Math.round(d)),
        (document.getElementById("addSubtractResult").innerHTML = r),
        displaySuccess("Operation successful!");
}
function convertDropdownDateToEpoch() {
    var e = parseInt(document.getElementById("yearDropdown").value, 10),
        t = parseInt(document.getElementById("monthDropdown").value, 10) - 1,
        n = parseInt(document.getElementById("dayDropdown").value, 10),
        o = parseInt(document.getElementById("hourDropdown").value, 10),
        l = parseInt(document.getElementById("minuteDropdown").value, 10),
        a = parseInt(document.getElementById("secondDropdown").value, 10),
        c = new Date(e, t, n, o, l, a).getTime() / 1e3;
    (document.getElementById("dropdownDateToEpochResult").textContent = "Epoch time: " + c), displaySuccess("Dropdown date to epoch conversion successful!");
}
function convertTimeZone() {
    var e = parseInt(document.getElementById("epochTime").textContent, 10),
        t = parseInt(document.getElementById("timeZoneDropdown").value, 10);
    (document.getElementById("convertedTimeZoneResult").textContent = "Adjusted Epoch for Time Zone: " + (e + 60 * t)), displaySuccess("Timezone conversion successful!");
}
function convertEpochToHumanReadable() {
    var e = parseInt(document.getElementById("epochInput").value, 10),
        t = document.getElementById("epochToHumanUseGMT").checked;
    if (isNaN(e)) {
        displayError("Please enter a valid epoch time.");
        return;
    }
    var n = new Date(1e3 * e),
        o = "GMT: " + n.toUTCString(),
        l = n.toLocaleString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" }),
        a = n.getTimezoneOffset(),
        c = Math.abs(a),
        i = Math.floor(c / 60),
        d = c % 60,
        r = "Your time zone: " + l + (" (GMT" + (a > 0 ? "-" : "+") + (i < 10 ? "0" : "") + i + ":" + (d < 10 ? "0" : "")) + d + ")",
        s = "Relative: " + timeSince(1e3 * e);
    (document.getElementById("epochToHumanResult").innerHTML = t ? o + "<br>" + s + "<br>" + r : r + "<br>" + s + "<br>" + o), displaySuccess("Conversion successful!");
}
function timeSince(e) {
    var t = Math.floor((new Date() - e) / 1e3),
        n = t / 31536e3;
    return n > 1
        ? Math.floor(n) + " years ago"
        : (n = t / 2592e3) > 1
        ? Math.floor(n) + " months ago"
        : (n = t / 86400) > 1
        ? Math.floor(n) + " days ago"
        : (n = t / 3600) > 1
        ? Math.floor(n) + " hours ago"
        : (n = t / 60) > 1
        ? Math.floor(n) + " minutes ago"
        : Math.floor(t) + " seconds ago";
}
function convertCalendarDateToEpoch() {
    var e,
        t,
        n,
        o = document.getElementById("calendarDateToEpoch").value,
        l = document.getElementById("calendarUseGMT").checked;
    if (!o) {
        displayError("Please select a valid date.");
        return;
    }
    var a = o.split("-"),
        c = parseInt(a[0], 10),
        i = parseInt(a[1], 10) - 1,
        d = parseInt(a[2], 10),
        r = new Date(c, i, d),
        s = document.getElementById("time12AMCal").checked,
        u = document.getElementById("time12PMCal").checked;
    document.getElementById("customTimeToggle").checked
        ? ((e = parseInt(document.getElementById("customHour").value, 10)), (t = parseInt(document.getElementById("customMinute").value, 10)), (n = parseInt(document.getElementById("customSecond").value, 10)))
        : s
        ? ((e = 0), (t = 0), (n = 0))
        : u
        ? ((e = 12), (t = 0), (n = 0))
        : ((e = 0), (t = 0), (n = 0)),
        r.setHours(e),
        r.setMinutes(t),
        r.setSeconds(n);
    var m = r.getTime() / 1e3;
    l && (m -= 60 * r.getTimezoneOffset()), (document.getElementById("calendarDateToEpochResult").textContent = "Epoch time: " + m), displaySuccess("Conversion successful!");
}
document.getElementById("customTimeToggle").addEventListener("change", function () {
    this.checked ? (document.getElementById("ampmCheck").style.display = "none") : (document.getElementById("ampmCheck").style.display = "inline-block");
}),
    document.getElementById("epochType").addEventListener("change", function () {
        "specific" === this.value ? (document.getElementById("specificEpochInput").style.display = "inline-block") : (document.getElementById("specificEpochInput").style.display = "none");
    }),
    document.getElementById("epochType").addEventListener("change", function () {
        document.getElementById("specificEpochInput").disabled = "specific" !== this.value;
    });
