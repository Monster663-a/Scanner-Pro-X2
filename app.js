// ======================================
// Scanner Pro X Ultimate
// App
// ======================================

const app = document.getElementById("mainContent");

// ======================================
// بدء التطبيق
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    bindMenu();

});

// ======================================
// ربط أزرار القائمة
// ======================================

function bindMenu(){

    document.getElementById("dashboardMenu")
        .onclick = loadDashboard;

    document.getElementById("scannerMenu")
        .onclick = loadScanner;

    document.getElementById("watchlistMenu")
        .onclick = loadWatchlist;

    document.getElementById("momentumMenu")
        .onclick = loadMomentum;

    document.getElementById("hotStocksMenu")
        .onclick = loadHotStocks;

    document.getElementById("newsMenu")
        .onclick = loadNews;

    document.getElementById("settingsMenu")
        .onclick = loadSettings;

}
// ======================================
// لوحة التحكم
// ======================================

function loadDashboard() {

    app.innerHTML = `

    <h2>🏠 لوحة التحكم</h2>

    <br>

    <div class="cards">

        <div class="card">
            <h3>عدد الأسهم</h3>
            <div class="value" id="stockCount">0</div>
        </div>

        <div class="card">
            <h3>شراء قوي</h3>
            <div class="value" id="strongBuyCount">0</div>
        </div>

        <div class="card">
            <h3>شراء</h3>
            <div class="value" id="buyCount">0</div>
        </div>

        <div class="card">
            <h3>مراقبة</h3>
            <div class="value" id="watchCount">0</div>
        </div>

    </div>

    <div class="card">

        <h3>

        مرحبًا بك في Scanner Pro X Ultimate

        </h3>

        <br>

        <p>

        اختر من القائمة الجانبية لبدء فحص الأسهم الأمريكية وتحليلها.

        </p>

    </div>

    `;

}
// ======================================
// صفحة فاحص الأسهم
// ======================================

function loadScanner() {

    app.innerHTML = `

    <h2>🔍 فاحص الأسهم</h2>

    <br>

    <button id="startScan" class="scanButton">

        ▶️ بدء الفحص

    </button>

    <div class="progress">

        <div class="progress-bar" id="progressBar">

            0%

        </div>

    </div>

    <table>

        <thead>

            <tr>

                <th>السهم</th>
                <th>السعر</th>
                <th>التغير %</th>
                <th>الزخم</th>
                <th>الحجم</th>
                <th>التقييم</th>

            </tr>

        </thead>

        <tbody id="scannerBody">

        </tbody>

    </table>

    `;

    document
        .getElementById("startScan")
        .addEventListener("click", () => {

            if (typeof scanStocks === "function") {

                scanStocks();

            } else {

                alert("ملف scanner.js غير جاهز بعد.");

            }

        });

}
// ======================================
// الصفحات التي سنكملها لاحقًا
// ======================================

function loadWatchlist(){

    app.innerHTML = `
        <h2>⭐ قائمتي</h2>
        <p>سيتم تطوير هذه الصفحة قريبًا.</p>
    `;

}

function loadMomentum(){

    app.innerHTML = `
        <h2>🚀 الزخم</h2>
        <p>سيتم تطوير هذه الصفحة قريبًا.</p>
    `;

}

function loadHotStocks(){

    app.innerHTML = `
        <h2>🔥 الأسهم الساخنة</h2>
        <p>سيتم تطوير هذه الصفحة قريبًا.</p>
    `;

}

function loadNews(){

    app.innerHTML = `
        <h2>📰 الأخبار</h2>
        <p>سيتم تطوير هذه الصفحة قريبًا.</p>
    `;

}

function loadSettings(){

    app.innerHTML = `
        <h2>⚙️ الإعدادات</h2>
        <p>سيتم تطوير هذه الصفحة قريبًا.</p>
    `;

}
