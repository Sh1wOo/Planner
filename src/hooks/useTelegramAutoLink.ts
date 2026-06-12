import { useEffect } from "react";
import { getTelegramInitData } from "../lib/telegram";
import { linkTelegram } from "../api/auth";

export function useTelegramAutoLink(isAuthenticated: boolean) {
  useEffect(() => {
    if (!isAuthenticated) return;

    const initData = getTelegramInitData();
    if (!initData) return;

    linkTelegram(initData).catch((error) => {
      console.error("Telegram auto-link failed", error);
    });
  }, [isAuthenticated]);
}