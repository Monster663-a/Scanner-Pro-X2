// =====================================
// Scanner Pro X v3
// =====================================

// ================================
// Stocks List
// ================================

const STOCKS = [

"NVDA",
"MSFT",
"AAPL",
"AMZN",
"META",
"TSLA",
"AMD",
"COHR",
"AVGO",
"SNDK",
"GOOGL",
"ORCL",
"CRM",
"CRWD",
"MRVL",
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
"WDC",
"RDDT",
"HIMS",
"HOOD",
"RKLB",
"ASTS",
"DELL",
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

// ================================
// Filters
// ================================

function getScannerFilters(){

    return{

        minPrice:Number(document.getElementById("minPrice")?.value)||0,

        maxPrice:Number(document.getElementById("maxPrice")?.value)||999999,

        minChange:Number(document.getElementById("minChange")?.value)||0,

        search:document.getElementById("searchSymbol")?.value
            .trim()
            .toUpperCase() || ""

    };

}
// =====================================
// Main Scanner
// =====================================

async function scanStocks(){

    const tbody = document.getElementById("scannerBody");

    if(!tbody){

        return;

    }

    tbody.innerHTML = `
    <tr>
        <td colspan="7">Scanning stocks...</td>
    </tr>
    `;

    const filters = getScannerFilters();

    const results = [];

    for(const symbol of STOCKS){

        if(
            filters.search &&
            !symbol.includes(filters.search)
        ){
            continue;
        }

        const quote = await getQuote(symbol);

        if(!quote){

            continue;

        }

        const price = Number(quote.c);

        const change = Number(quote.dp);

        if(price < filters.minPrice){

            continue;

        }

        if(price > filters.maxPrice){

            continue;

        }

        if(change < filters.minChange){

            continue;

        }

        const history = await getHistory(symbol,"1day",5);

       const momentum = calculateMomentumScore(quote,history);

        const signal = buildSignal(change,momentum);
const entry = getEntrySignal(momentum,change);

const momentumStart = estimateMomentumStart();
        results.push({

            symbol,

            price,

            change,

            momentum,

            signal

        });

    }

    results.sort((a,b)=>{

        return b.momentum-a.momentum;

    });

    tbody.innerHTML = "";

    results.forEach(stock=>{

        const entry = stock.price;

        const stop = stock.price * 0.98;

        const target = stock.price * 1.04;

        tbody.innerHTML += `
        <tr>

            <td>${stock.symbol}</td>

            <td>$${stock.price.toFixed(2)}</td>

            <td>${stock.change.toFixed(2)}%</td>

            <td>$${entry.toFixed(2)}</td>

            <td>$${stop.toFixed(2)}</td>

            <td>$${target.toFixed(2)}</td>

            <td class="${stock.signal.className}">
                ${stock.signal.text}
            </td>

        </tr>
        `;

    });

}
// =====================================
// Hot Stocks
// =====================================

async function loadHotStocks(){

    const tbody = document.getElementById("hotStocksBody");

    if(!tbody) return;

    tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

    const stocks = [];

    for(const symbol of STOCKS){

        const quote = await getQuote(symbol);

        if(!quote) continue;

        stocks.push({

            symbol,

            price:Number(quote.c),

            change:Number(quote.dp)

        });

    }

    stocks.sort((a,b)=>b.change-a.change);

    tbody.innerHTML = "";

    stocks.slice(0,10).forEach((stock,index)=>{

        tbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
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

    const tbody=document.getElementById("momentumBody");

    if(!tbody) return;

    tbody.innerHTML="<tr><td colspan='7'>Loading...</td></tr>";

    const ranking=[];

    for(const symbol of STOCKS){

        const quote=await getQuote(symbol);

        if(!quote) continue;

        const history=await getHistory(symbol,"1day",5);

        const momentum=calculateMomentum(history);

        const signal=buildSignal(

            Number(quote.dp),

            momentum

        );

        ranking.push({

            symbol,

            price:Number(quote.c),

            score:momentum,

            signal

        });

    }

    ranking.sort((a,b)=>b.score-a.score);

    tbody.innerHTML="";

    ranking.slice(0,20).forEach((stock,index)=>{

        const stop=stock.price*0.98;

        const target=stock.price*1.04;

        tbody.innerHTML+=`
        <tr>

            <td>${index+1}</td>

            <td>${stock.symbol}</td>

            <td>${stock.score.toFixed(2)}</td>

            <td>$${stock.price.toFixed(2)}</td>

            <td>$${stop.toFixed(2)}</td>

            <td>$${target.toFixed(2)}</td>

            <td class="${stock.signal.className}">
                ${stock.signal.text}
            </td>

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

    tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

    const list = [];

    for(const symbol of STOCKS){

        const quote = await getQuote(symbol);

        if(!quote) continue;

        list.push({
            symbol,
            price:Number(quote.c),
            change:Number(quote.dp)
        });

    }

    list.sort((a,b)=>b.change-a.change);

    tbody.innerHTML = "";

    list.slice(0,20).forEach((stock,index)=>{

        tbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
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

    tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

    const list = [];

    for(const symbol of STOCKS){

        const quote = await getQuote(symbol);

        if(!quote) continue;

        list.push({
            symbol,
            price:Number(quote.c),
            change:Number(quote.dp)
        });

    }

    list.sort((a,b)=>a.change-b.change);

    tbody.innerHTML = "";

    list.slice(0,20).forEach((stock,index)=>{

        tbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${stock.symbol}</td>
            <td>$${stock.price.toFixed(2)}</td>
            <td class="bearish">${stock.change.toFixed(2)}%</td>
        </tr>
        `;

    });

}

// =====================================
// Scanner Button
// =====================================

const scanButton = document.getElementById("scanBtn");

if(scanButton){

    scanButton.addEventListener("click",scanStocks);

}

// =====================================
// Auto Refresh Scanner Pages
// =====================================

setInterval(()=>{

    const page = document.querySelector(".page.active");

    if(!page) return;

    switch(page.id){

        case "scannerPage":
            scanStocks();
            break;

        case "hotStocksPage":
            loadHotStocks();
            break;

        case "momentumPage":
            loadMomentum();
            break;

        case "gainersPage":
            loadGainers();
            break;

        case "losersPage":
            loadLosers();
            break;

        case "newsPage":
            loadNews();
            break;

    }

},60000);

console.log("✅ Scanner Pro X v3 Loaded");
// =====================================
// تحليل أفضل وقت للدخول
// =====================================

function getEntrySignal(score, change){

    if(score >= 90 && change < 8){

        return{
            text:"🟢 شراء قوي الآن",
            color:"strong-buy"
        };

    }

    if(score >= 75 && change < 12){

        return{
            text:"🟢 دخول مناسب",
            color:"bullish"
        };

    }

    if(score >= 60){

        return{
            text:"🟡 راقب السهم",
            color:"watch"
        };

    }

    return{

        text:"🔴 لا تدخل",
        color:"avoid"

    };

}

// =====================================
// تقدير بداية الزخم
// =====================================

function estimateMomentumStart(){

    const now = new Date();

    const h = now.getHours();

    const m = now.getMinutes();

    const start = new Date();

    start.setHours(h);

    start.setMinutes(m-15);

    return start.toLocaleTimeString([],{

        hour:"2-digit",
        minute:"2-digit"

    });

}
