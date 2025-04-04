"use client";

import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApi<T = any>() {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const sendRequest = useCallback(
    async (
      url: string,
      method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
      body?: any,
      config?: AxiosRequestConfig
    ) => {
      setResponse({ data: null, error: null, loading: true });

      try {
        const res: AxiosResponse<T> = await axios({
          url,
          method,
          data: body,
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            ...(config?.headers || {}),
          },
          ...config,
        });

        setResponse({ data: res.data, error: null, loading: false });
        return res.data;
      } catch (error: any) {
        setResponse({
          data: null,
          error: error.response?.data?.message || error.message,
          loading: false,
        });
      }
    },
    []
  );

  return { ...response, sendRequest };
}
