// =====================================
// Scanner Pro X v4 Engine
// =====================================

// ================================
// Stocks
// ================================

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
"DDOG",

// قائمتك
"COHR",
"SNDK",
"WDC",
"DELL",
"IBM",
"SPCX",
"AMKR",
"SKHY",
"FN",
"VRT",
"ASML",
"BE",
"AUR"

];

// =====================================
// Cache
// =====================================

const CACHE = new Map();

const CACHE_TIME = 60000;

// =====================================
// Delay
// =====================================

function sleep(ms){

    return new Promise(resolve=>setTimeout(resolve,ms));

}

// =====================================
// Cache Helpers
// =====================================

function getCache(symbol){

    const item = CACHE.get(symbol);

    if(!item){

        return null;

    }

    if(Date.now()-item.time > CACHE_TIME){

        CACHE.delete(symbol);

        return null;

    }

    return item.data;

}

function saveCache(symbol,data){

    CACHE.set(symbol,{

        data,

        time:Date.now()

    });

}
// =====================================
// قراءة الفلاتر
// =====================================

function getScannerFilters(){

    return{

        minPrice:Number(document.getElementById("minPrice")?.value)||0,

        maxPrice:Number(document.getElementById("maxPrice")?.value)||999999,

        minChange:Number(document.getElementById("minChange")?.value)||0,

        search:document.getElementById("searchSymbol")?.value
            .trim()
            .toUpperCase()

    };

}

// =====================================
// جلب بيانات السهم مع Cache
// =====================================

async function getStockData(symbol){

    const cached = getCache(symbol);

    if(cached){

        return cached;

    }

    try{

        const quote = await getQuote(symbol);

        await sleep(300);

        if(!quote){

            return null;

        }

        const history = await getHistory(symbol,"1day",5);

        await sleep(700);

        if(!history){

            return null;

        }

        const data = {

            symbol,

            quote,

            history

        };

        saveCache(symbol,data);

        return data;

    }catch(error){

        console.error(symbol,error);

        return null;

    }

}

// =====================================
// Batch Scanner
// =====================================

async function scanBatch(list){

    const results=[];

    for(const symbol of list){

        const stock = await getStockData(symbol);

        if(stock){

            results.push(stock);

        }

    }

    return results;

}
// =====================================
// إنشاء صف في الجدول
// =====================================

function addScannerRow(stock){

    const tbody = document.getElementById("scannerBody");

    if(!tbody){

        return;

    }

    const quote = stock.quote;

    const history = stock.history;

    const price = Number(quote.c);

    const change = Number(quote.dp);

    const momentum = calculateMomentumScore(quote,history);

    const signal = buildSignal(change,momentum);

    const row = document.createElement("tr");

    row.innerHTML = `

        <td>${stock.symbol}</td>

        <td>$${price.toFixed(2)}</td>

        <td>${change.toFixed(2)}%</td>

        <td>${momentum}/100</td>

        <td>$${price.toFixed(2)}</td>

        <td>$${(price*0.98).toFixed(2)}</td>

        <td>$${(price*1.04).toFixed(2)}</td>

        <td class="${signal.className}">
            ${signal.text}
        </td>

    `;

    tbody.appendChild(row);

}

// =====================================
// محرك الفحص الرئيسي
// =====================================

async function scanStocks(){

    const tbody = document.getElementById("scannerBody");

    if(!tbody){

        return;

    }

    tbody.innerHTML = "";

    const filters = getScannerFilters();

    const batchSize = 5;

    for(let i=0;i<STOCKS.length;i+=batchSize){

        const batch = STOCKS.slice(i,i+batchSize);

        const results=[];

for(const symbol of batch){

    const stock=await getStockDataWithRetry(symbol);

    if(stock){

        results.push(stock);

    }

}

        for(const stock of results){

            const quote = stock.quote;

            const price = Number(quote.c);

            const change = Number(quote.dp);

            if(price < filters.minPrice) continue;

            if(price > filters.maxPrice) continue;

            if(change < filters.minChange) continue;

            if(
                filters.search &&
                !stock.symbol.includes(filters.search)
            ){
                continue;
            }

            addScannerRow(stock);
updateProgress(
    Math.min(i+batchSize,STOCKS.length),
    STOCKS.length
);

await sleep(1500);

    }

}
// =====================================
// Retry عند حدوث 429
// =====================================

async function getStockDataWithRetry(symbol){

    let retries = 3;

    while(retries > 0){

        try{

            const data = await getStockData(symbol);

            if(data){

                return data;

            }

        }catch(error){

            console.log(symbol,error);

        }

        retries--;

        await sleep(2000);

    }

    return null;

}

// =====================================
// Progress
// =====================================

function updateProgress(done,total){

    const progress=document.getElementById("scanProgress");

    if(!progress){

        return;

    }

    const percent=Math.round((done/total)*100);

    progress.style.width=percent+"%";

    progress.innerText=percent+"%";

}
