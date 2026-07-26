// =====================================
// Scanner Pro X v3 API
// =====================================

// ---------- API Keys ----------

const FINNHUB_API_KEY = "d9gj7g1r01qq6536hg2gd9gj7g1r01qq6536hg30";

const TWELVEDATA_API_KEY = "47ce95d1154741b49acb5803d83dd79f";

// ---------- API URLs ----------

const FINNHUB_URL = "https://finnhub.io/api/v1";

const TWELVE_URL = "https://api.twelvedata.com";

// ---------- Cache ----------

const cache = {};

const CACHE_TIME = 60000;

// ---------- Sleep ----------

function sleep(ms){

    return new Promise(resolve=>setTimeout(resolve,ms));

}
// =====================================
// Cache Functions
// =====================================

function getCache(key){

    const item = cache[key];

    if(!item){

        return null;

    }

    if(Date.now() - item.time > CACHE_TIME){

        delete cache[key];

        return null;

    }

    return item.data;

}

function setCache(key,data){

    cache[key]={

        data:data,

        time:Date.now()

    };

}

// =====================================
// Get Quote
// =====================================

async function getQuote(symbol){

    const cacheKey="quote_"+symbol;

    const cached=getCache(cacheKey);

    if(cached){

        return cached;

    }

    try{

        const response=await fetch(

            `${FINNHUB_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`

        );

        if(!response.ok){

            throw new Error("HTTP "+response.status);

        }

        const data=await response.json();

        if(typeof data.c!=="number"){

            throw new Error("Invalid quote");

        }

        setCache(cacheKey,data);

        await sleep(250);

        return data;

    }catch(error){

        console.error("Quote Error:",symbol,error);

        return null;

    }

}
// =====================================
// Get Historical Data
// =====================================

async function getHistory(symbol, interval = "1day", outputsize = 30){

    const cacheKey = `history_${symbol}_${interval}_${outputsize}`;

    const cached = getCache(cacheKey);

    if(cached){

        return cached;

    }

    try{

        const response = await fetch(

            `${TWELVE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVEDATA_API_KEY}`

        );

        if(!response.ok){

            throw new Error("HTTP " + response.status);

        }

        const data = await response.json();

        if(!data.values){

            return [];

        }

        setCache(cacheKey,data.values);

        await sleep(250);

        return data.values;

    }catch(error){

        console.error("History Error:",symbol,error);

        return [];

    }

}

// =====================================
// Latest Candle
// =====================================

async function getLatestCandle(symbol){

    const candles = await getHistory(symbol,"1day",1);

    if(candles.length===0){

        return null;

    }

    return candles[0];

}

// =====================================
// Helpers
// =====================================

function toNumber(value){

    return Number(value)||0;

}

function average(array){

    if(array.length===0){

        return 0;

    }

    const total=array.reduce((sum,value)=>sum+value,0);

    return total/array.length;

}
// =====================================
// Momentum
// =====================================

function calculateMomentum(history){

    if(!history || history.length < 5){

        return 0;

    }

    const latest = toNumber(history[0].close);

    const previous = toNumber(history[4].close);

    if(previous === 0){

        return 0;

    }

    return ((latest - previous) / previous) * 100;

}

// =====================================
// Volatility
// =====================================

function calculateVolatility(history){

    if(!history || history.length < 10){

        return 0;

    }

    const moves = [];

    for(let i=0;i<history.length-1;i++){

        const current = toNumber(history[i].close);

        const previous = toNumber(history[i+1].close);

        if(previous===0){

            continue;

        }

        moves.push(

            Math.abs(

                ((current-previous)/previous)*100

            )

        );

    }

    return average(moves);

}

// =====================================
// Trading Signal
// =====================================

function buildSignal(change,momentum){

    if(change>=3 && momentum>=5){

        return{

            text:"Strong Buy",

            className:"strong-buy"

        };

    }

    if(change>=1){

        return{

            text:"Bullish",

            className:"bullish"

        };

    }

    if(change<=-3){

        return{

            text:"Avoid",

            className:"avoid"

        };

    }

    if(change<0){

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
// =====================================
// Company News
// =====================================

async function getNews(symbol){

    const cacheKey = "news_" + symbol;

    const cached = getCache(cacheKey);

    if(cached){

        return cached;

    }

    try{

        const today = new Date();

        const from = new Date();

        from.setDate(today.getDate() - 7);

        const fromDate = from.toISOString().split("T")[0];

        const toDate = today.toISOString().split("T")[0];

        const response = await fetch(

            `${FINNHUB_URL}/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${FINNHUB_API_KEY}`

        );

        if(!response.ok){

            throw new Error("HTTP " + response.status);

        }

        const data = await response.json();

        setCache(cacheKey,data);

        await sleep(250);

        return data;

    }catch(error){

        console.error("News Error:",symbol,error);

        return [];

    }

}

// =====================================
// Retry
// =====================================

async function retryRequest(request,retries=3){

    for(let i=0;i<retries;i++){

        try{

            const result = await request();

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

// =====================================
// API Ready
// =====================================

console.log("✅ Scanner Pro X API Loaded");
