import Cookies from "js-cookie";

const COOKIE_NAME = "auth_token";

export const setCookie = (value) => {
  Cookies.set(COOKIE_NAME, value, {
    expires: 1,
    path: "/",
    sameSite: "Strict"
  });
};

export const getCookie = () => {
  return Cookies.get(COOKIE_NAME) || null;
};

export const removeCookie = () => {
  Cookies.remove(COOKIE_NAME, { path: "/" });
};