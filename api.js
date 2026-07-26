// ======================================
// Scanner Pro X API
// ======================================

// ===== API KEYS =====

const FINNHUB_API_KEY = "d9gj7g1r01qq6536hg2gd9gj7g1r01qq6536hg30";

const TWELVE_API_KEY = "47ce95d1154741b49acb5803d83dd79f";

// ===== BASE URLS =====

const FINNHUB_BASE = "https://finnhub.io/api/v1";

const TWELVE_BASE = "https://api.twelvedata.com";

// ===== Request Delay =====

const REQUEST_DELAY = 800;

// ===== Sleep =====

function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}
// ======================================
// Get Stock Quote (Finnhub)
// ======================================

async function getQuote(symbol){

    try{

        const response = await fetch(

            `${FINNHUB_BASE}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`

        );

        if(!response.ok){

            throw new Error("Failed to fetch quote");

        }

        const data = await response.json();

        await sleep(REQUEST_DELAY);

        return data;

    }catch(error){

        console.error("Quote Error:", symbol, error);

        return null;

    }

}
// ======================================
// Get Historical Data (Twelve Data)
// ======================================

async function getHistory(symbol, interval = "1day", outputsize = 30){

    try{

        const url = `${TWELVE_BASE}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVE_API_KEY}`;

        const response = await fetch(url);

        if(!response.ok){

            throw new Error("Failed to fetch history");

        }

        const data = await response.json();

        await sleep(REQUEST_DELAY);

        if(!data.values){

            return [];

        }

        return data.values;

    }catch(error){

        console.error("History Error:", symbol, error);

        return [];

    }

}

// ======================================
// Get Latest Candle
// ======================================

async function getLatestCandle(symbol){

    const candles = await getHistory(symbol,"1day",1);

    if(candles.length === 0){

        return null;

    }

    return candles[0];

}
// ======================================
// Helpers
// ======================================

function average(values){

    if(!values || values.length === 0){

        return 0;

    }

    const sum = values.reduce((total, value) => total + value, 0);

    return sum / values.length;

}

function calculateMomentum(history){

    if(!history || history.length < 5){

        return 0;

    }

    const latest = Number(history[0].close);

    const previous = Number(history[4].close);

    return ((latest - previous) / previous) * 100;

}

function calculateVolatility(history){

    if(!history || history.length < 10){

        return 0;

    }

    const changes = [];

    for(let i = 0; i < history.length - 1; i++){

        const current = Number(history[i].close);

        const previous = Number(history[i + 1].close);

        changes.push(Math.abs(((current - previous) / previous) * 100));

    }

    return average(changes);

}

// ======================================
// Trading Signal
// ======================================

function buildSignal(change, momentum){

    if(change >= 3 && momentum >= 5){

        return{
            text:"Strong Buy",
            className:"strong-buy"
        };

    }

    if(change >= 1){

        return{
            text:"Bullish",
            className:"bullish"
        };

    }

    if(change <= -3){

        return{
            text:"Avoid",
            className:"avoid"
        };

    }

    if(change < 0){

        return{
            text:"Bearish",
            className:"bearish"
        };

    }

    return{
        text:"Watch",
        className:"watch"
    };

}
// ======================================
// Cache
// ======================================

const apiCache = new Map();

function getCache(key){

    const item = apiCache.get(key);

    if(!item){

        return null;

    }

    const age = Date.now() - item.time;

    if(age > 60000){

        apiCache.delete(key);

        return null;

    }

    return item.data;

}

function setCache(key,data){

    apiCache.set(key,{
        data:data,
        time:Date.now()
    });

}

// ======================================
// Get Company News
// ======================================

async function getNews(symbol){

    const cacheKey = "news_" + symbol;

    const cached = getCache(cacheKey);

    if(cached){

        return cached;

    }

    try{

        const today = new Date();

        const from = new Date();

        from.setDate(today.getDate()-7);

        const toDate = today.toISOString().split("T")[0];

        const fromDate = from.toISOString().split("T")[0];

        const url =
        `${FINNHUB_BASE}/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${FINNHUB_API_KEY}`;

        const response = await fetch(url);

        if(!response.ok){

            throw new Error("News request failed");

        }

        const data = await response.json();

        setCache(cacheKey,data);

        await sleep(REQUEST_DELAY);

        return data;

    }catch(error){

        console.error("News Error:",symbol,error);

        return [];

    }

}

// ======================================
// Retry Request
// ======================================

async function retryRequest(requestFunction,retries=3){

    for(let i=0;i<retries;i++){

        try{

            const result = await requestFunction();

            if(result){

                return result;

            }

        }catch(error){

            console.error("Retry",i+1,error);

        }

        await sleep(1000);

    }

    return null;

}
