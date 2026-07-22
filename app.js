document.addEventListener("DOMContentLoaded", () => {
    updateMarketStatus();

    document.getElementById("scanBtn").addEventListener("click", () => {
        document.getElementById("lastScan").textContent =
            new Date().toLocaleTimeString();

        alert("Scan Started (Demo)");
    });
});

function updateMarketStatus() {

    const status = document.getElementById("marketStatus");

    const now = new Date();

    const hour = now.getUTCHours();

    // تقريباً ساعات تداول نيويورك (13:30–20:00 UTC)
    if (hour >= 13 && hour < 20) {
        status.textContent = "🟢 Market Open";
        status.style.color = "#22c55e";
    } else {
        status.textContent = "🔴 Market Closed";
        status.style.color = "#ef4444";
    }

}
