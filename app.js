// =====================================
// Scanner Pro X v3
// =====================================

// ================================
// Watchlist
// ================================

const WATCHLIST = [

    "NVDA",
    "AAPL",
    "MSFT",
    "TSLA",
    "AMD",
    "META"
    "MRVL"
];

// ================================
// Pages
// ================================

const pages = {

    dashboard: document.getElementById("dashboardPage"),
    scanner: document.getElementById("scannerPage"),
    hotStocks: document.getElementById("hotStocksPage"),
    momentum: document.getElementById("momentumPage"),
    gainers: document.getElementById("gainersPage"),
    losers: document.getElementById("losersPage"),
    news: document.getElementById("newsPage"),
    risk: document.getElementById("riskPage"),
    settings: document.getElementById("settingsPage")

};

// ================================
// Menu Buttons
// ================================

const menu = {

    dashboard: document.getElementById("dashboardMenu"),
    scanner: document.getElementById("scannerMenu"),
    hotStocks: document.getElementById("hotStocksMenu"),
    momentum: document.getElementById("momentumMenu"),
    gainers: document.getElementById("gainersMenu"),
    losers: document.getElementById("losersMenu"),
    news: document.getElementById("newsMenu"),
    risk: document.getElementById("riskMenu"),
    settings: document.getElementById("settingsMenu")

};

// ================================
// DOM Ready
// ================================

document.addEventListener("DOMContentLoaded",()=>{

    initNavigation();

    buildWatchlist();

    updateMarketStatus();

    updateWatchlist();

});
// =====================================
// Navigation
// =====================================

function hideAllPages(){

    Object.values(pages).forEach(page=>{

        if(page){

            page.style.display="none";

        }

    });

}

function clearActiveMenu(){

    Object.values(menu).forEach(item=>{

        if(item){

            item.classList.remove("active");

        }

    });

}

function showPage(pageName){

    hideAllPages();

    clearActiveMenu();

    if(pages[pageName]){

        pages[pageName].style.display="block";

    }

    if(menu[pageName]){

        menu[pageName].classList.add("active");

    }

    switch(pageName){

        case "hotStocks":

            if(typeof loadHotStocks==="function"){

                loadHotStocks();

            }

        break;

        case "momentum":

            if(typeof loadMomentum==="function"){

                loadMomentum();

            }

        break;

        case "gainers":

            if(typeof loadGainers==="function"){

                loadGainers();

            }

        break;

        case "losers":

            if(typeof loadLosers==="function"){

                loadLosers();

            }

        break;

        case "news":

            if(typeof loadNews==="function"){

                loadNews();

            }

        break;

    }

}

function initNavigation(){

    menu.dashboard.onclick=()=>showPage("dashboard");

    menu.scanner.onclick=()=>showPage("scanner");

    menu.hotStocks.onclick=()=>showPage("hotStocks");

    menu.momentum.onclick=()=>showPage("momentum");

    menu.gainers.onclick=()=>showPage("gainers");

    menu.losers.onclick=()=>showPage("losers");

    menu.news.onclick=()=>showPage("news");

    menu.risk.onclick=()=>showPage("risk");

    menu.settings.onclick=()=>showPage("settings");

    showPage("dashboard");

}
// =====================================
// Dashboard
// =====================================

function buildWatchlist(){

    const tbody = document.getElementById("watchlistBody");

    if(!tbody){

        return;

    }

    tbody.innerHTML = "";

    WATCHLIST.forEach(symbol=>{

        tbody.innerHTML += `
        <tr>
            <td>${symbol}</td>
            <td id="${symbol}_price">--</td>
            <td id="${symbol}_change">--</td>
            <td id="${symbol}_signal" class="watch">Loading...</td>
        </tr>
        `;

    });

}

// =====================================
// Update Watchlist
// =====================================

async function updateWatchlist(){

    for(const symbol of WATCHLIST){

        const quote = await getQuote(symbol);

        if(!quote){

            continue;

        }

        const price = Number(quote.c);

        const change = Number(quote.dp);

        const history = await getHistory(symbol,"1day",5);

        const momentum = calculateMomentum(history);

        const signal = buildSignal(change,momentum);

        document.getElementById(symbol+"_price").textContent =
            "$" + price.toFixed(2);

        document.getElementById(symbol+"_change").textContent =
            change.toFixed(2) + "%";

        const signalCell = document.getElementById(symbol+"_signal");

        signalCell.textContent = signal.text;

        signalCell.className = signal.className;

    }

}

// =====================================
// Market Status
// =====================================

function updateMarketStatus(){

    const status = document.getElementById("marketStatus");

    if(!status){

        return;

    }

    const now = new Date();

    const hour = now.getUTCHours();

    if(hour >= 13 && hour < 20){

        status.textContent = "🟢 US Market Open";

    }else{

        status.textContent = "🔴 US Market Closed";

    }

}
// =====================================
// Position Size Calculator
// =====================================

function calculatePositionSize(){

    const account = Number(document.getElementById("accountSize").value);

    const riskPercent = Number(document.getElementById("riskPercent").value);

    const entry = Number(document.getElementById("entryPrice").value);

    const stop = Number(document.getElementById("stopPrice").value);

    if(
        !account ||
        !riskPercent ||
        !entry ||
        !stop ||
        entry === stop
    ){
        return;
    }

    const maxRisk = account * (riskPercent / 100);

    const riskPerShare = Math.abs(entry - stop);

    const shares = Math.floor(maxRisk / riskPerShare);

    document.getElementById("maxRisk").textContent =
        "$" + maxRisk.toFixed(2);

    document.getElementById("shareSize").textContent =
        shares.toLocaleString();

}

// =====================================
// Buttons
// =====================================

const riskButton = document.getElementById("calculateRisk");

if(riskButton){

    riskButton.addEventListener("click",calculatePositionSize);

}

const refreshButton = document.getElementById("refreshDashboard");

if(refreshButton){

    refreshButton.addEventListener("click",async()=>{

        await updateWatchlist();

    });

}

// =====================================
// Dashboard Cards
// =====================================

function updateDashboardCards(){

    document.getElementById("stocksScanned").textContent =
        WATCHLIST.length;

    document.getElementById("marketTrend").textContent =
        "Live";

    document.getElementById("hotStocksCount").textContent =
        "--";

    document.getElementById("momentumCount").textContent =
        "--";

}

// =====================================
// Auto Refresh
// =====================================

setInterval(async()=>{

    await updateWatchlist();

    updateDashboardCards();

},60000);

updateDashboardCards();
// =====================================
// News
// =====================================

async function loadNews(){

    const tbody = document.getElementById("newsBody");

    if(!tbody){

        return;

    }

    tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

    const news = await getNews("AAPL");

    tbody.innerHTML = "";

    if(!news || news.length===0){

        tbody.innerHTML =
        "<tr><td colspan='4'>No news found.</td></tr>";

        return;

    }

    news.slice(0,10).forEach(item=>{

        const date = new Date(item.datetime * 1000);

        tbody.innerHTML += `
        <tr>
            <td>${date.toLocaleDateString()}</td>
            <td>AAPL</td>
            <td>${item.headline}</td>
            <td>${item.source}</td>
        </tr>
        `;

    });

}

// =====================================
// Refresh News Button
// =====================================

const refreshNewsButton = document.getElementById("refreshNews");

if(refreshNewsButton){

    refreshNewsButton.addEventListener("click",loadNews);

}

// =====================================
// Startup
// =====================================

window.addEventListener("load",()=>{

    updateDashboardCards();

    updateMarketStatus();

    updateWatchlist();

});
