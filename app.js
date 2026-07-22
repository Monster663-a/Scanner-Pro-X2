document.addEventListener("DOMContentLoaded", () => {

    updateMarketStatus();

    document.getElementById("scanBtn").addEventListener("click", async () => {

        document.getElementById("lastScan").textContent =
            new Date().toLocaleTimeString();

        const quote = await getQuote("NVDA");

        if (!quote) {
            alert("API Error");
            return;
        }

        const row = document.querySelector("#watchlistTable tr");

        row.cells[1].textContent = "$" + quote.price.toFixed(2);
        row.cells[2].textContent = quote.change.toFixed(2) + "%";
        row.cells[3].textContent = "Live";

    });

});

function updateMarketStatus() {

    const status = document.getElementById("marketStatus");

    const now = new Date();
    const hour = now.getUTCHours();

    if (hour >= 13 && hour < 20) {
        status.textContent = "🟢 Market Open";
        status.style.color = "#22c55e";
    } else {
        status.textContent = "🔴 Market Closed";
        status.style.color = "#ef4444";
    }

}
