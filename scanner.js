// =====================================
// Scanner Pro X
// =====================================

const STOCKS = [

"NVDA",
"MSFT",
"AAPL",
"AMZN",
"META",
"TSLA",
"AMD",
"PLTR",
"AVGO",
"NFLX",
"GOOGL",
"ORCL",
"CRM",
"CRWD",
"SNOW",
"SHOP",
"UBER",
"COIN",
"SMCI",
"ARM",
"MU",
"ANET",
"PANW",
"TSM",
"QCOM",
"INTC",
"MRVL",
"RDDT",
"HIMS",
"HOOD",
"RKLB",
"ASTS",
"TOST",
"APP",
"IONQ",
"QBTS",
"TEM",
"SOUN",
"PATH",
"CAVA",
"CELH",
"DDOG"

];

// =====================================
// Helpers
// =====================================

function getScannerFilters(){

    return{

        minPrice:Number(document.getElementById("minPrice").value)||0,

        maxPrice:Number(document.getElementById("maxPrice").value)||99999,

        minChange:Number(document.getElementById("minChange").value)||0,

        search:document.getElementById("searchSymbol").value.trim().toUpperCase()

    };

}
// =====================================
// Main Scanner
// =====================================

async function scanStocks(){

    const filters = getScannerFilters();

    const tbody = document.getElementById("scannerBody");

    if(!tbody) return;

    tbody.innerHTML = "";

    for(const symbol of STOCKS){

        if(filters.search && !symbol.includes(filters.search)){
            continue;
        }

        try{

            const quote = await getQuote(symbol);

            if(!quote) continue;

            const price = Number(quote.c);
            const change = Number(quote.dp);

            if(price < filters.minPrice) continue;
            if(price > filters.maxPrice) continue;
            if(change < filters.minChange) continue;

            const entry = price.toFixed(2);
            const stop = (price * 0.98).toFixed(2);
            const target = (price * 1.04).toFixed(2);

            let signal = "Watch";
            let css = "watch";

            if(change >= 3){
                signal = "Strong Buy";
                css = "strong-buy";
            }
            else if(change >= 1){
                signal = "Bullish";
                css = "bullish";
            }
            else if(change <= -3){
                signal = "Avoid";
                css = "avoid";
            }
            else if(change < 0){
                signal = "Bearish";
                css = "bearish";
            }

            tbody.innerHTML += `
            <tr>
                <td>${symbol}</td>
                <td>$${price.toFixed(2)}</td>
                <td>${change.toFixed(2)}%</td>
                <td>$${entry}</td>
                <td>$${stop}</td>
                <td>$${target}</td>
                <td class="${css}">${signal}</td>
            </tr>
            `;

        }catch(error){

            console.error(symbol,error);

        }

    }

}

// =====================================
// Scan Button
// =====================================

const scanButton = document.getElementById("scanBtn");

if(scanButton){

    scanButton.addEventListener("click", scanStocks);

}
// =====================================
// Hot Stocks
// =====================================

async function loadHotStocks(){

    const tbody = document.getElementById("hotStocksBody");

    if(!tbody) return;

    tbody.innerHTML = "";

    let results = [];

    for(const symbol of STOCKS){

        try{

            const quote = await getQuote(symbol);

            if(!quote) continue;

            results.push({

                symbol,

                price:Number(quote.c),

                change:Number(quote.dp)

            });

        }catch(e){

            console.error(e);

        }

    }

    results.sort((a,b)=>b.change-a.change);

    results.slice(0,10).forEach(stock=>{

        tbody.innerHTML += `
        <tr>
            <td>${stock.symbol}</td>
            <td>$${stock.price.toFixed(2)}</td>
            <td class="bullish">${stock.change.toFixed(2)}%</td>
        </tr>
        `;

    });

}

// =====================================
// Momentum Ranking
// =====================================

async function loadMomentum(){

    const tbody = document.getElementById("momentumBody");

    if(!tbody) return;

    tbody.innerHTML = "";

    let ranking = [];

    for(const symbol of STOCKS){

        try{

            const quote = await getQuote(symbol);

            if(!quote) continue;

            const price = Number(quote.c);
            const change = Number(quote.dp);

            const score = (change * 10);

            ranking.push({

                symbol,

                price,

                change,

                score

            });

        }catch(e){

            console.error(e);

        }

    }

    ranking.sort((a,b)=>b.score-a.score);

    ranking.forEach((stock,index)=>{

        const entry = stock.price.toFixed(2);
        const stop = (stock.price*0.98).toFixed(2);
        const target = (stock.price*1.04).toFixed(2);

        let signal = "Watch";
        let css = "watch";

        if(stock.change >= 3){

            signal = "Strong Buy";
            css = "strong-buy";

        }else if(stock.change >= 1){

            signal = "Bullish";
            css = "bullish";

        }else if(stock.change < 0){

            signal = "Bearish";
            css = "bearish";

        }

        tbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${stock.symbol}</td>
            <td>${stock.score.toFixed(0)}</td>
            <td>$${entry}</td>
            <td>$${stop}</td>
            <td>$${target}</td>
            <td class="${css}">${signal}</td>
        </tr>
        `;

    });

}
// =====================================
// Top Gainers
// =====================================

async function loadGainers(){

    const tbody = document.getElementById("gainersBody");

    if(!tbody) return;

    tbody.innerHTML = "";

    let stocks = [];

    for(const symbol of STOCKS){

        try{

            const quote = await getQuote(symbol);

            if(!quote) continue;

            stocks.push({
                symbol,
                price:Number(quote.c),
                change:Number(quote.dp)
            });

        }catch(e){

            console.error(e);

        }

    }

    stocks
        .sort((a,b)=>b.change-a.change)
        .slice(0,10)
        .forEach(stock=>{

            tbody.innerHTML += `
            <tr>
                <td>${stock.symbol}</td>
                <td>$${stock.price.toFixed(2)}</td>
                <td class="bullish">${stock.change.toFixed(2)}%</td>
            </tr>
            `;

        });

}

// =====================================
// Top Losers
// =====================================

async function loadLosers(){

    const tbody = document.getElementById("losersBody");

    if(!tbody) return;

    tbody.innerHTML = "";

    let stocks = [];

    for(const symbol of STOCKS){

        try{

            const quote = await getQuote(symbol);

            if(!quote) continue;

            stocks.push({
                symbol,
                price:Number(quote.c),
                change:Number(quote.dp)
            });

        }catch(e){

            console.error(e);

        }

    }

    stocks
        .sort((a,b)=>a.change-b.change)
        .slice(0,10)
        .forEach(stock=>{

            tbody.innerHTML += `
            <tr>
                <td>${stock.symbol}</td>
                <td>$${stock.price.toFixed(2)}</td>
                <td class="bearish">${stock.change.toFixed(2)}%</td>
            </tr>
            `;

        });

}

// =====================================
// Auto Refresh
// =====================================

setInterval(()=>{

    if(document.getElementById("scannerPage").style.display==="block"){

        scanStocks();

    }

    if(document.getElementById("hotStocksPage").style.display==="block"){

        loadHotStocks();

    }

    if(document.getElementById("momentumPage").style.display==="block"){

        loadMomentum();

    }

    if(document.getElementById("gainersPage").style.display==="block"){

        loadGainers();

    }

    if(document.getElementById("losersPage").style.display==="block"){

        loadLosers();

    }

},60000);

// =====================================
// Initial Scan
// =====================================

document.addEventListener("DOMContentLoaded",()=>{

    if(typeof scanStocks==="function"){

        scanStocks();

    }

});
