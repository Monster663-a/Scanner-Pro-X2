const STOCKS = [

"NVDA","TSLA","AAPL","AMD","META","AMZN",
"MSFT","GOOGL","NFLX","PLTR","SMCI","AVGO",
"MU","CRM","ORCL","INTC","QCOM","ARM",
"CRWD","PANW","SNOW","SHOP","UBER","COIN",
"RBLX","IONQ","QBTS","RKLB","ASTS","LUNR",
"TEM","HIMS","SOUN","SOFI","HOOD","CAVA",
"CELH","RDDT","TTD","APP","NET","DDOG"

];

let scannerData = [];

const runScannerBtn = document.getElementById("runScanner");

if (runScannerBtn) {

runScannerBtn.addEventListener("click", async () => {

const tbody = document.getElementById("scannerResults");

const minPrice = Number(document.getElementById("minPrice").value);
const maxPrice = Number(document.getElementById("maxPrice").value);
const minChange = Number(document.getElementById("minChange").value);

const searchSymbol = document
.getElementById("searchSymbol")
.value
.trim()
.toUpperCase();

tbody.innerHTML = "";

scannerData = [];
    for (const symbol of STOCKS) {

if (searchSymbol && symbol !== searchSymbol) {
continue;
}

const quote = await getQuote(symbol);

if (!quote) continue;

if (quote.price < minPrice) continue;

if (quote.price > maxPrice) continue;

if (Math.abs(quote.change) < minChange) continue;

scannerData.push({

symbol,

price: quote.price,

change: quote.change

});

}
    scannerData.sort((a, b) => b.change - a.change);

scannerData.forEach(stock => {

tbody.innerHTML += `
<tr>
<td>${stock.symbol}</td>
<td>$${stock.price.toFixed(2)}</td>
<td>${stock.change.toFixed(2)}%</td>
<td>${stock.change > 0 ? "🟢 Bullish" : "🔴 Bearish"}</td>
</tr>
`;

});

});

}
