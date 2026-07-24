const WATCHLIST = [
    "NVDA",
    "TSLA",
    "AAPL",
    "AMD",
    "META",
    "AMZN"
];
document.addEventListener("DOMContentLoaded", () => {

    updateMarketStatus();

    document.getElementById("scanBtn").addEventListener("click", async () => {

        document.getElementById("lastScan").textContent =
            new Date().toLocaleTimeString();

        const rows = document.querySelectorAll("#watchlistTable tr");

for (let i = 0; i < WATCHLIST.length; i++) {

    const symbol = WATCHLIST[i];

    const quote = await getQuote(symbol);

    if (!quote) continue;

    rows[i].cells[1].textContent =
        "$" + Number(quote.price).toFixed(2);

    rows[i].cells[2].textContent =
        Number(quote.change).toFixed(2) + "%";

    rows[i].cells[3].textContent = "Live";

}

    });

});

function updateMarketStatus() {
buildWatchlist();
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
function buildWatchlist() {

    const table = document.getElementById("watchlistTable");

    table.innerHTML = "";

    WATCHLIST.forEach(symbol => {

        table.innerHTML += `
            <tr>
                <td>${symbol}</td>
                <td>--</td>
                <td>--</td>
                <td>Waiting...</td>
            </tr>
        `;

    });

}
const scannerMenu = document.getElementById("scannerMenu");

scannerMenu.addEventListener("click", (e) => {

    e.preventDefault();

    document.getElementById("dashboardPage").style.display = "none";

    document.getElementById("scannerPage").style.display = "block";

});
// التنقل بين الصفحات

const dashboardLink = document.querySelector(".sidebar a.active");
const hotStocksMenu = document.getElementById("hotStocksMenu");

dashboardLink.addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("dashboardPage").style.display = "block";
    document.getElementById("scannerPage").style.display = "none";
    document.getElementById("hotStocksPage").style.display = "none";
});

scannerMenu.addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("dashboardPage").style.display = "none";
    document.getElementById("scannerPage").style.display = "block";
    document.getElementById("hotStocksPage").style.display = "none";
});

hotStocksMenu.addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("dashboardPage").style.display = "none";
    document.getElementById("scannerPage").style.display = "none";
    document.getElementById("hotStocksPage").style.display = "block";
});
