import { useState, useEffect } from "react";

export function useEthPriceInr() {
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updatePrice = async () => {
      const data = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
      ).then((res) => res.json());
      setPrice(data.ethereum.inr);
      setLoading(false);
    };

    updatePrice();
    const interval = setInterval(updatePrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return { price, loading };
}
