function toggleTheme() {
    var e = document.body;
    e.classList.contains("dark-mode") ? (e.classList.remove("dark-mode"), e.classList.add("light-mode")) : (e.classList.remove("light-mode"), e.classList.add("dark-mode"));
}
function displayError(e) {
    clearMessages();
    document.getElementById("errorMessage").textContent = e;
}
function displaySuccess(e) {
    clearMessages();    
    document.getElementById("successMessage").textContent = e;
}
function clearMessages() {
    (document.getElementById("errorMessage").textContent = ""), (document.getElementById("successMessage").textContent = "");
}
function toggleCustomTime() {
    var e = document.getElementById("customTimeToggle").checked;
    console.log("Custom Time Toggle:", e);
    var t = e ? "inline" : "none";
    (document.getElementById("customHour").style.display = t),
        (document.getElementById("customMinute").style.display = t),
        (document.getElementById("customSecond").style.display = t),
        (document.getElementById("time12AMCal").style.display = e ? "none" : "inline"),
        (document.getElementById("time12PMCal").style.display = e ? "none" : "inline"),
        (document.getElementById("customHour").disabled = !e),
        (document.getElementById("customMinute").disabled = !e),
        (document.getElementById("customSecond").disabled = !e);
}
function presetTime(e) {
    console.log("Preset Time triggered for:", e.id, "Checked Status:", e.checked);
    var t = "time12AMCal" === e.id,
        n = "time12PMCal" === e.id;
    return (
        t && e.checked
            ? (console.log("Setting time to 12 AM."),
              (document.getElementById("customHour").value = 0),
              (document.getElementById("customMinute").value = 0),
              (document.getElementById("customSecond").value = 0),
              (document.getElementById("time12PMCal").checked = !1))
            : n &&
              e.checked &&
              (console.log("Setting time to 12 PM."),
              (document.getElementById("customHour").value = 12),
              (document.getElementById("customMinute").value = 0),
              (document.getElementById("customSecond").value = 0),
              (document.getElementById("time12AMCal").checked = !1)),
        "Function executed"
    );
}
function updateTitle() {
    var e = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        t = document.getElementById("title");
    e <= 800 ? (t.textContent = "Epoch Calculator") : (t.textContent = "Epoch Calculator and Unix Calculations");
}
function showLoading() {
    document.getElementById("loadingIndicator").style.display = "inline";
}
function hideLoading() {
    document.getElementById("loadingIndicator").style.display = "none";
    
}
function handleOperationCompletion() {
    hideLoading(), clearMessages();
}
updateTitle(), window.addEventListener("resize", updateTitle);
