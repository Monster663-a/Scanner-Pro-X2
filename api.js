const FINNHUB_API_KEY = "d9gj7g1r01qq6536hg2gd9gj7g1r01qq6536hg30";

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
const TWELVE_DATA_API_KEY = "47ce95d1154741b49acb5803d83dd79f";

async function getVolume(symbol) {

    try {

        const response = await fetch(
            `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`
        );

        const data = await response.json();

        return {
            volume: Number(data.volume || 0)
        };

    } catch (error) {

        console.error(error);

        return {
            volume: 0
        };

    }

}
