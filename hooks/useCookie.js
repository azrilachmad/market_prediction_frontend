import { useState, useCallback, useEffect } from "react";
import { OptionsType } from "cookies-next/lib/types";
import { getCookieValueByKey, setCookieValue } from "@/helpers";
import { deleteCookie, getCookie } from "cookies-next";

export default function useCookie(name, defaultValue) {
  const [value, setValue] = useState(() => {
    const cookie = getCookieValueByKey(name) ?? "";
    if (cookie) return cookie;
    if (defaultValue) setCookieValue(name, defaultValue);
    return defaultValue ? defaultValue : null;
  });

  const updateCookie = useCallback(
    (newValue, options) => {
      setCookieValue(name, newValue, options);
      setValue(newValue);
    },
    [name]
  );

  const removeCookie = useCallback(() => {
    deleteCookie(name);
    setValue(null);
  }, [name]);

  return [value, updateCookie, removeCookie];
}
