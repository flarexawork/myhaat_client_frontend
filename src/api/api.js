import axios from "axios";
import { api_url } from "../utils/config";

const accessTokenKey = "customerToken";
const refreshTokenKey = "customerRefreshToken";
const retryableStatuses = [408, 425, 429, 500, 502, 503, 504];
const maxGetRetries = 2;

const api = axios.create({
  baseURL: `${api_url}/api`,
});

const isTokenExpired = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return true;

    const normalized = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    if (!payload?.exp) return false;
    return payload.exp * 1000 <= Date.now();
  } catch (error) {
    return true;
  }
};

const clearTokens = () => {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
};

let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(refreshTokenKey);
  if (!refreshToken) {
    clearTokens();
    throw new Error("Missing refresh token");
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${api_url}/api/auth/refresh-token`, { refreshToken })
      .then(({ data }) => {
        if (data?.accessToken) {
          localStorage.setItem(accessTokenKey, data.accessToken);
        }
        if (data?.refreshToken) {
          localStorage.setItem(refreshTokenKey, data.refreshToken);
        }
        return data?.accessToken;
      })
      .catch((error) => {
        clearTokens();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(accessTokenKey);
  config.headers = config.headers || {};

  if (token && !isTokenExpired(token)) {
    config.headers.authorization = `Bearer ${token}`;
    return config;
  }

  if (token && isTokenExpired(token)) {
    try {
      const refreshedAccessToken = await refreshAccessToken();
      if (refreshedAccessToken) {
        config.headers.authorization = `Bearer ${refreshedAccessToken}`;
      }
    } catch (error) {
      clearTokens();
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const method = (originalRequest.method || "get").toLowerCase();
    const status = error?.response?.status;
    const isNetworkError = !error?.response;
    const retryCount = originalRequest.__retryCount || 0;
    const isAuthRefreshRequest = originalRequest.url?.includes("/auth/refresh-token");

    if (status === 401 && !originalRequest._retry && !isAuthRefreshRequest) {
      originalRequest._retry = true;
      try {
        const refreshedAccessToken = await refreshAccessToken();
        if (refreshedAccessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.authorization = `Bearer ${refreshedAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    const shouldRetry =
      method === "get" &&
      retryCount < maxGetRetries &&
      (isNetworkError || retryableStatuses.includes(status));

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    originalRequest.__retryCount = retryCount + 1;
    const waitTime = 600 * 2 ** retryCount;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return api(originalRequest);
  },
);

export default api;
