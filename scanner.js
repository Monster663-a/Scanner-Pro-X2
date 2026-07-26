// ======================================
// Scanner Pro X Ultimate
// محرك الفحص
// ======================================

// قائمة الأسهم الافتراضية
const STOCKS = [

    "NVDA",
    "TSLA",
    "AAPL",
    "MSFT",
    "META",
    "AMZN",
    "AMD",
    "AVGO",
    "PLTR",
    "NFLX",
    "GOOGL",
    "COHR",
    "WDC",
    "SNDK",
    "QCOM",
    "DELL",
    "IBM",
    "AMKR",
    "FN",
    "VRT",
    "ASML",
    "BE",
    "AUR"

];

// ======================================
// بدء الفحص
// ======================================

async function scanStocks(){

    const body = document.getElementById("scannerBody");
    const progress = document.getElementById("progressBar");

   body.innerHTML = "";

resetScannerStats();

    progress.style.width = "0%";
    progress.textContent = "0%";

    let completed = 0;

    for(const symbol of STOCKS){

        await scanOneStock(symbol);

        completed++;

        const percent = Math.round(
            (completed / STOCKS.length) * 100
        );

        progress.style.width = percent + "%";
        progress.textContent = percent + "%";
    }

}
// ======================================
// فحص سهم واحد
// ======================================

async function scanOneStock(symbol){

    const quote = await getQuote(symbol);

    if(!quote){

        return;

    }

    const history = await getHistory(symbol);

    const momentum = calculateMomentum(history);

    const avgVolume = averageVolume(history);

    const volumeToday =
        history.length > 0
        ? history[history.length-1].volume
        : 0;

    let rating = "🔴 تجنب";
    let css = "avoid";

    if(momentum >= 80){

        rating = "🟢 شراء قوي";
        css = "buyStrong";

    }
    else if(momentum >= 60){

        rating = "🟢 شراء";
        css = "buy";

    }
    else if(momentum >= 40){

        rating = "🟡 مراقبة";
        css = "watch";

    }
    else{

        rating = "🟠 انتظر";
        css = "wait";

    }

    addScannerRow({

        symbol,

        price: quote.price,

        change: quote.change,

        momentum,

        volume: volumeToday,

        averageVolume: avgVolume,

        rating,

        css

    });
updateScannerStats({
    momentum
});
}
// ======================================
// إضافة صف إلى جدول النتائج
// ======================================

function addScannerRow(stock){

    const body = document.getElementById("scannerBody");

    const row = document.createElement("tr");

    row.innerHTML = `

        <td><strong>${stock.symbol}</strong></td>

        <td>$${stock.price.toFixed(2)}</td>

        <td class="${stock.change >= 0 ? 'buyStrong' : 'avoid'}">
            ${stock.change.toFixed(2)}%
        </td>

        <td>${stock.momentum}/100</td>

        <td>${formatNumber(stock.volume)}</td>

        <td class="${stock.css}">
            ${stock.rating}
        </td>

    `;

    body.appendChild(row);

}
// ======================================
// تحديث إحصائيات لوحة التحكم
// ======================================

let scannerStats = {
    total: 0,
    strongBuy: 0,
    buy: 0,
    watch: 0
};

function updateScannerStats(stock){

    scannerStats.total++;

    if(stock.momentum >= 80){

        scannerStats.strongBuy++;

    }else if(stock.momentum >= 60){

        scannerStats.buy++;

    }else if(stock.momentum >= 40){

        scannerStats.watch++;

    }

    const stockCount = document.getElementById("stockCount");
    const strongBuyCount = document.getElementById("strongBuyCount");
    const buyCount = document.getElementById("buyCount");
    const watchCount = document.getElementById("watchCount");

    if(stockCount) stockCount.textContent = scannerStats.total;
    if(strongBuyCount) strongBuyCount.textContent = scannerStats.strongBuy;
    if(buyCount) buyCount.textContent = scannerStats.buy;
    if(watchCount) watchCount.textContent = scannerStats.watch;

}

// ======================================
// إعادة تعيين الإحصائيات
// ======================================

function resetScannerStats(){

    scannerStats = {
        total:0,
        strongBuy:0,
        buy:0,
        watch:0
    };

}
