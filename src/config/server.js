import axios from "axios";

const server = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

server.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const redirectUrl = `${window.location.origin}/#/unauthorized?redirect_url=%2F`;
      const currentUrl = new URL(window.location.href);
      const urls = [
        `${window.location.origin}/#/`,
        `${window.location.origin}/`,
        redirectUrl,
      ];

      const isCurrentUrlInList = urls.some(
        (url) => new URL(url).href === currentUrl.href,
      );

      if (!isCurrentUrlInList) {
        window.location.href = redirectUrl;
      }
    }

    return Promise.reject(error);
  },
);

server.interceptors.request.use((config) => {
  // const token = sessionStorage.getItem(LOGIN_TOKEN);
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default server;
