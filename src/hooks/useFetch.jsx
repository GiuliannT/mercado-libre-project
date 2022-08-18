import { useEffect, useState } from "react";

export const useFetch = (url1, url2 = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url1);
        const json = await response.json();
        if (url2) {
          const response2 = await fetch(url2);
          const json2 = await response2.json();
          setData({ ...json, ...json2 });
        } else {
          setData(json);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url1, url2]);

  return { data, loading, error };
};
