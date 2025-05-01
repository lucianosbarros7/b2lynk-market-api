// api/market.js
const fetch = require('node-fetch');

let cache = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const API_KEY = 'SUA_CHAVE_TWELVE_DATA';
const BASE_URL = 'https://api.twelvedata.com/price';

const symbols = {
  sp500: 'SPX',
  nasdaq: 'NDX',
  dowjones: 'DJI',
  msci: 'MSCIW', // Verificar se está disponível
  russell: 'RUT',
};

module.exports = async (req, res) => {
  const now = Date.now();
  if (cache && now - lastFetch < CACHE_DURATION) {
    return res.status(200).json(cache);
  }

  try {
    const results = {};
    for (const [key, symbol] of Object.entries(symbols)) {
      const response = await fetch(`${BASE_URL}?symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
      results[key] = {
        name: key.toUpperCase(),
        price: data.price ? parseFloat(data.price).toFixed(2) : null,
      };
    }

    cache = results;
    lastFetch = now;
    return res.status(200).json(results);

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar dados de mercado', details: error.message });
  }
};
