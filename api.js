// ======================================
// Scanner Pro X Ultimate
// API Configuration
// ======================================

// ضع مفاتيح الـ API هنا
const API = {

    finnhub: "d9gj7g1r01qq6536hg2gd9gj7g1r01qq6536hg30",

    twelveData: "47ce95d1154741b49acb5803d83dd79f"

};

// ======================================
// إعدادات عامة
// ======================================

const REQUEST_DELAY = 600;

const CACHE_TIME = 60000;

const cache = new Map();

// ======================================
// انتظار بين الطلبات
// ======================================

function sleep(ms){

    return new Promise(resolve=>setTimeout(resolve,ms));

}

// ======================================
// قراءة من الكاش
// ======================================

function getCache(key){

    const item = cache.get(key);

    if(!item) return null;

    if(Date.now()-item.time>CACHE_TIME){

        cache.delete(key);

        return null;

    }

    return item.data;

}

// ======================================
// حفظ داخل الكاش
// ======================================

function saveCache(key,data){

    cache.set(key,{

        time:Date.now(),

        data

    });

}
// ======================================
// جلب سعر السهم الحالي
// ======================================

async function getQuote(symbol){

    const key = "quote_" + symbol;

    const cached = getCache(key);

    if(cached) return cached;

    await sleep(REQUEST_DELAY);

    try{

        const response = await fetch(

            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API.finnhub}`

        );

        if(!response.ok){

            throw new Error("HTTP " + response.status);

        }

        const data = await response.json();

        const quote = {

            symbol,

            price: Number(data.c || 0),

            change: Number(data.dp || 0),

            high: Number(data.h || 0),

            low: Number(data.l || 0),

            open: Number(data.o || 0),

            previousClose: Number(data.pc || 0)

        };

        saveCache(key, quote);

        return quote;

    }

    catch(error){

        console.error("Quote Error:", symbol, error);

        return null;

    }

}
// ======================================
// جلب البيانات التاريخية
// ======================================

async function getHistory(symbol) {

    const key = "history_" + symbol;

    const cached = getCache(key);

    if (cached) return cached;

    await sleep(REQUEST_DELAY);

    try {

        const url =
            `https://api.twelvedata.com/time_series?` +
            `symbol=${symbol}` +
            `&interval=1day` +
            `&outputsize=30` +
            `&apikey=${API.twelveData}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        if (!data.values) {
            console.warn("لا توجد بيانات تاريخية:", symbol);
            return [];
        }

        const history = data.values.reverse().map(item => ({
            date: item.datetime,
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.close),
            volume: Number(item.volume)
        }));

        saveCache(key, history);

        return history;

    } catch (error) {

        console.error("History Error:", symbol, error);

        return [];

    }

}
// ======================================
// حساب قوة الزخم
// ======================================

function calculateMomentum(history){

    if(!history || history.length < 20){

        return 0;

    }

    const last = history[history.length-1].close;

    const ma10 = average(
        history.slice(-10).map(c=>c.close)
    );

    const ma20 = average(
        history.slice(-20).map(c=>c.close)
    );

    let score = 0;

    if(last > ma10) score += 40;

    if(ma10 > ma20) score += 40;

    const gain =
        ((last-history[0].close)/history[0].close)*100;

    if(gain > 0){

        score += Math.min(20,gain);

    }

    return Math.round(Math.min(score,100));

}

// ======================================
// متوسط حجم التداول
// ======================================

function averageVolume(history){

    if(!history || history.length===0){

        return 0;

    }

    return Math.round(

        average(

            history.map(c=>c.volume)

        )

    );

}

// ======================================
// حساب المتوسط
// ======================================

function average(values){

    if(values.length===0){

        return 0;

    }

    return values.reduce(

        (a,b)=>a+b,0

    )/values.length;

}

// ======================================
// تنسيق الأرقام
// ======================================

function formatNumber(number){

    return new Intl.NumberFormat("en-US").format(

        Math.round(number)

    );

}
