import { useState, useEffect } from 'react';
import { serverUrl  } from './server-url';

export function useFetchState<T>(url: string, defVal: T): [T, React.Dispatch<React.SetStateAction<T>>]
{
  const [data, setData] = useState<T>(defVal);

  useEffect(() => {
    async function fetchData() {
      const requestUrl = serverUrl + url;
      const response = await fetch(requestUrl, {
          method: "GET",
          credentials: "include",
          mode: 'cors'
      });
      const json = await response.json();
      setData(json);
    }
    fetchData();
  }, [url]);

  return [data, setData];
};

export function useFetch<T>(url: string) : T
{
  const [data, setData] = useState<T>();

  useEffect(() => {
    async function fetchData() {
      const requestUrl = serverUrl + url;
      const response = await fetch(requestUrl, {
          method: "GET",
          credentials: "include",
          mode: 'cors'
      });
      const json = await response.json();
      setData(json);
    }
    fetchData();
  }, [url]);

  return data as T;
};
