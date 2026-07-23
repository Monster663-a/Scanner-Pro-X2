const STOCKS = [

"NVDA","TSLA","AAPL","AMD","META","AMZN",
"MSFT","GOOGL","NFLX","PLTR","SMCI","AVGO",
"MU","CRM","ORCL","INTC","QCOM","ARM",
"CRWD","PANW","SNOW","SHOP","UBER","COIN",
"RBLX","IONQ","QBTS","RKLB","ASTS","LUNR",
"TEM","HIMS","SOUN","SOFI","HOOD","CAVA",
"CELH","RDDT","TTD","APP","NET","DDOG"

];

const runScannerBtn = document.getElementById("runScanner");

if (runScannerBtn) {

    runScannerBtn.addEventListener("click", async () => {

        const tbody = document.getElementById("scannerResults");
const minPrice = Number(document.getElementById("minPrice").value);
const maxPrice = Number(document.getElementById("maxPrice").value);
const minChange = Number(document.getElementById("minChange").value);
        tbody.innerHTML = "";

        for (const symbol of STOCKS) {

            const quote = await getQuote(symbol);
const volume = await getVolume(symbol);
            console.log(symbol, volume);
            if (!quote) continue;
if (quote.price < minPrice) continue;

if (quote.price > maxPrice) continue;

if (Math.abs(quote.change) < minChange) continue;
            if (volume.volume < minVolume) continue;
            const row = `
            <tr>
                <td>${symbol}</td>
                <td>$${quote.price}</td>
                <td>${quote.change.toFixed(2)}%</td>
                <td>${quote.change > 0 ? "🟢 Bullish" : "🔴 Bearish"}</td>
            </tr>
            `;

            tbody.innerHTML += row;

        }

    });

}
