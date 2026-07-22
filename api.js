const FINNHUB_API_KEY = "ضع مفتاح Finnhub هنا";

async function getQuote(symbol) {
    try {
        const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );

        const data = await response.json();

        return {
            price: data.c,
            change: data.dp
        };

    } catch (error) {
        console.error(error);
        return null;
    }
}
