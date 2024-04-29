import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetNews  = () => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://api.coingecko.com/api/v3/news/data', {
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