// getCryptoAPI.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true', {
        headers: {
          'x-cg-demo-api-key': 'CG-Gq2PcqWGcCyFgsxQiSGkMFdw'
        }
      });
      setCryptoData(response.data);
    };

    fetchData();
  }, []);

  return cryptoData;
};