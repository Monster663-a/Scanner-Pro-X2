// ===============================
// Scanner Pro X
// app.js
// ===============================

const WATCHLIST = [
    "NVDA",
    "TSLA",
    "AAPL",
    "AMD",
    "META",
    "AMZN"
];

const dashboardPage = document.getElementById("dashboardPage");
const scannerPage = document.getElementById("scannerPage");
const hotStocksPage = document.getElementById("hotStocksPage");
const momentumPage = document.getElementById("momentumPage");

const dashboardMenu = document.querySelector(".sidebar a.active");
const scannerMenu = document.getElementById("scannerMenu");
const hotStocksMenu = document.getElementById("hotStocksMenu");
const momentumMenu = document.getElementById("momentumMenu");

document.addEventListener("DOMContentLoaded", () => {

    buildWatchlist();

    updateMarketStatus();

    document
        .getElementById("scanBtn")
        .addEventListener("click", updateWatchlist);

});
// ===============================
// Watchlist
// ===============================

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

async function updateWatchlist() {

    document.getElementById("lastScan").textContent =
        new Date().toLocaleTimeString();

    const rows = document.querySelectorAll("#watchlistTable tr");

    for (let i = 0; i < WATCHLIST.length; i++) {

        const quote = await getQuote(WATCHLIST[i]);

        if (!quote) continue;

        rows[i].cells[1].textContent =
            "$" + Number(quote.price).toFixed(2);

        rows[i].cells[2].textContent =
            Number(quote.change).toFixed(2) + "%";

        rows[i].cells[3].textContent =
            quote.change >= 0 ? "🟢 Live" : "🔴 Live";

    }

}

function updateMarketStatus() {

    const status = document.getElementById("marketStatus");

    const hour = new Date().getUTCHours();

    if (hour >= 13 && hour < 20) {

        status.textContent = "🟢 Market Open";
        status.style.color = "#22c55e";

    } else {

        status.textContent = "🔴 Market Closed";
        status.style.color = "#ef4444";

    }

}
// ===============================
// Navigation
// ===============================

function hideAllPages() {

    dashboardPage.style.display = "none";
    scannerPage.style.display = "none";
    hotStocksPage.style.display = "none";
    momentumPage.style.display = "none";

}

dashboardMenu.addEventListener("click", (e) => {

    e.preventDefault();

    hideAllPages();

    dashboardPage.style.display = "block";

});

scannerMenu.addEventListener("click", (e) => {

    e.preventDefault();

    hideAllPages();

    scannerPage.style.display = "block";

});

hotStocksMenu.addEventListener("click", async (e) => {

    e.preventDefault();

    hideAllPages();

    hotStocksPage.style.display = "block";

    if (typeof loadHotStocks === "function") {

        await loadHotStocks();

    }

});

momentumMenu.addEventListener("click", async (e) => {

    e.preventDefault();

    hideAllPages();

    momentumPage.style.display = "block";

    if (typeof loadMomentum === "function") {

        await loadMomentum();

    }

});
