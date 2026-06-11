export interface TelegramWebAppUserPayload {
  telegram_id: number | string
  username?: string
  first_name?: string
  last_name?: string
  init_data?: string
}

export function getTelegramWebAppInfo(): TelegramWebAppUserPayload | null {
  const telegram = (window as any)?.Telegram
  const webApp = telegram?.WebApp

  if (!webApp) {
    return null
  }

  const initData = typeof webApp.initData === 'string' ? webApp.initData : undefined
  const user = webApp.initDataUnsafe?.user

  if (!user?.id) {
    return null
  }

  return {
    telegram_id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    init_data: initData,
  }
}
