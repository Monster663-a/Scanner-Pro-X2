// ===============================
// Watchlist
// ===============================

const WATCHLIST = [

"NVDA",
"TSLA",
"AAPL",
"AMD",
"META",
"PLTR"

];

// ===============================
// Pages
// ===============================

const dashboardPage = document.getElementById("dashboardPage");
const scannerPage = document.getElementById("scannerPage");
const hotStocksPage = document.getElementById("hotStocksPage");
const momentumPage = document.getElementById("momentumPage");
const riskPage = document.getElementById("riskPage");
const gainersPage = document.getElementById("gainersPage");
const losersPage = document.getElementById("losersPage");
const newsPage = document.getElementById("newsPage");

// ===============================
// Menus
// ===============================

const dashboardMenu = document.getElementById("dashboardMenu");
const scannerMenu = document.getElementById("scannerMenu");
const hotStocksMenu = document.getElementById("hotStocksMenu");
const momentumMenu = document.getElementById("momentumMenu");
const riskMenu = document.getElementById("riskMenu");
const gainersMenu = document.getElementById("gainersMenu");
const losersMenu = document.getElementById("losersMenu");
const newsMenu = document.getElementById("newsMenu");

// ===============================
// DOM Ready
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    buildWatchlist();

    updateWatchlist();

    updateMarketStatus();

    const scanBtn = document.getElementById("scanBtn");

    if(scanBtn){

        scanBtn.addEventListener("click", () => {

            updateWatchlist();

        });

    }

});
// ===============================
// Hide All Pages
// ===============================

function hideAllPages(){

    dashboardPage.style.display = "none";
    scannerPage.style.display = "none";
    hotStocksPage.style.display = "none";
    momentumPage.style.display = "none";
    riskPage.style.display = "none";
    gainersPage.style.display = "none";
    losersPage.style.display = "none";
    newsPage.style.display = "none";

}

// ===============================
// Remove Active Menu
// ===============================

function clearMenu(){

    document.querySelectorAll(".sidebar nav a").forEach(item=>{

        item.classList.remove("active");

    });

}

// ===============================
// Show Page
// ===============================

function showPage(page,menu){

    hideAllPages();

    clearMenu();

    page.style.display="block";

    menu.classList.add("active");

}

// ===============================
// Navigation
// ===============================

dashboardMenu.onclick=()=>{

    showPage(dashboardPage,dashboardMenu);

};

scannerMenu.onclick=()=>{

    showPage(scannerPage,scannerMenu);

};

hotStocksMenu.onclick=()=>{

    showPage(hotStocksPage,hotStocksMenu);

    if(typeof loadHotStocks==="function"){

        loadHotStocks();

    }

};

momentumMenu.onclick=()=>{

    showPage(momentumPage,momentumMenu);

    if(typeof loadMomentum==="function"){

        loadMomentum();

    }

};

riskMenu.onclick=()=>{

    showPage(riskPage,riskMenu);

};

gainersMenu.onclick=()=>{

    showPage(gainersPage,gainersMenu);

    if(typeof loadGainers==="function"){

        loadGainers();

    }

};

losersMenu.onclick=()=>{

    showPage(losersPage,losersMenu);

    if(typeof loadLosers==="function"){

        loadLosers();

    }

};

newsMenu.onclick=()=>{

    showPage(newsPage,newsMenu);

    if(typeof loadNews==="function"){

        loadNews();

    }

};

// ===============================
// Default Page
// ===============================

showPage(dashboardPage,dashboardMenu);
// ===============================
// Dashboard
// ===============================

function buildWatchlist(){

    const table = document.getElementById("watchlistBody");

    if(!table) return;

    table.innerHTML="";

    WATCHLIST.forEach(symbol=>{

        table.innerHTML += `
        <tr>
            <td>${symbol}</td>
            <td id="${symbol}_price">-</td>
            <td id="${symbol}_change">-</td>
            <td id="${symbol}_signal">Loading...</td>
        </tr>
        `;

    });

}

// ===============================
// Update Watchlist
// ===============================

async function updateWatchlist(){

    for(const symbol of WATCHLIST){

        try{

            const quote = await getQuote(symbol);

            if(!quote) continue;

            const price = Number(quote.c).toFixed(2);

            const change = Number(quote.dp).toFixed(2);

            let signal="Watch";
            let css="watch";

            if(change>=3){

                signal="Strong Buy";
                css="strong-buy";

            }else if(change>=1){

                signal="Bullish";
                css="bullish";

            }else if(change<=-3){

                signal="Avoid";
                css="avoid";

            }else if(change<0){

                signal="Bearish";
                css="bearish";

            }

            document.getElementById(symbol+"_price").textContent="$"+price;

            document.getElementById(symbol+"_change").textContent=change+"%";

            const signalCell=document.getElementById(symbol+"_signal");

            signalCell.textContent=signal;

            signalCell.className=css;

        }catch(err){

            console.error(symbol,err);

        }

    }

}

// ===============================
// Market Status
// ===============================

function updateMarketStatus(){

    const market=document.getElementById("marketStatus");

    if(!market) return;

    const now=new Date();

    const hour=now.getUTCHours();

    if(hour>=13 && hour<20){

        market.textContent="🟢 US Market Open";

    }else{

        market.textContent="🔴 US Market Closed";

    }

}

// ===============================
// Auto Refresh
// ===============================

setInterval(()=>{

    updateWatchlist();

},60000);
