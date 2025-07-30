import { useState, useEffect } from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  initData: string
  initDataUnsafe: {
    query_id?: string
    user?: TelegramUser
    receiver?: TelegramUser
    chat?: {
      id: number
      type: string
      title?: string
      username?: string
      first_name?: string
      last_name?: string
    }
    chat_type?: string
    chat_instance?: string
    start_param?: string
    can_send_after?: number
    auth_date: number
    hash: string
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  onEvent: (eventType: string, eventHandler: () => void) => void
  offEvent: (eventType: string, eventHandler: () => void) => void
  sendData: (data: string) => void
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  openTelegramLink: (url: string) => void
  openInvoice: (url: string, callback?: (status: string) => void) => void
  showPopup: (params: {
    title?: string
    message: string
    buttons?: Array<{
      id?: string
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
      text: string
    }>
  }, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showScanQrPopup: (params: {
    text?: string
  }, callback?: (data: string) => void) => void
  closeScanQrPopup: () => void
  readTextFromClipboard: (callback?: (data: string | null) => void) => void
  requestWriteAccess: (callback?: (access: boolean) => void) => void
  requestContact: (callback?: (contact: {
    phone_number: string
    first_name: string
    last_name?: string
    user_id?: number
    vcard?: string
  }) => void) => void
  invokeCustomMethod: (method: string, params?: any) => void
  invokeCustomMethodAsync: (method: string, params?: any) => Promise<any>
  setCustomStyle: (css: string) => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  isVersionAtLeast: (version: string) => boolean
  platform: string
  version: string
  isIframe: boolean
  Utils: {
    parseColor: (color: string) => {
      r: number
      g: number
      b: number
      a: number
    }
    colorToRgb: (color: string) => string
    colorToHex: (color: string) => string
  }
}

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initTelegram = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        
        // Инициализация
        try {
          tg.ready()
          tg.expand()
        } catch (error) {
          console.warn('Ошибка инициализации Telegram Web App:', error)
        }
        
        // Получение данных пользователя
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user)
        }
        
        setWebApp(tg)
        setIsReady(true)
        
        // Установка цветов темы
        try {
          document.documentElement.style.setProperty(
            '--tg-theme-bg-color',
            tg.themeParams.bg_color || '#ffffff'
          )
          document.documentElement.style.setProperty(
            '--tg-theme-text-color',
            tg.themeParams.text_color || '#000000'
          )
          document.documentElement.style.setProperty(
            '--tg-theme-button-color',
            tg.themeParams.button_color || '#2481cc'
          )
          document.documentElement.style.setProperty(
            '--tg-theme-button-text-color',
            tg.themeParams.button_text_color || '#ffffff'
          )
          document.documentElement.style.setProperty(
            '--tg-theme-link-color',
            tg.themeParams.link_color || '#2481cc'
          )
          document.documentElement.style.setProperty(
            '--tg-theme-hint-color',
            tg.themeParams.hint_color || '#999999'
          )
        } catch (error) {
          console.warn('Ошибка установки темы:', error)
        }
      } else {
        // Для разработки вне Telegram
        console.warn('Telegram Web App не найден, запуск в режиме разработки')
        setIsReady(true)
      }
    }

    // Проверяем, загружен ли Telegram Web App
    if (window.Telegram?.WebApp) {
      initTelegram()
    } else {
      // Ждем загрузки Telegram Web App
      const checkTelegram = setInterval(() => {
        if (window.Telegram?.WebApp) {
          clearInterval(checkTelegram)
          initTelegram()
        }
      }, 100)

      // Таймаут для режима разработки
      setTimeout(() => {
        clearInterval(checkTelegram)
        if (!window.Telegram?.WebApp) {
          console.warn('Telegram Web App не загружен, запуск в режиме разработки')
          setIsReady(true)
        }
      }, 3000)
    }
  }, [])

  const showMainButton = (text: string, callback: () => void) => {
    if (webApp) {
      webApp.MainButton.text = text
      webApp.MainButton.show()
      webApp.MainButton.onClick(callback)
    }
  }

  const hideMainButton = () => {
    if (webApp) {
      webApp.MainButton.hide()
    }
  }

  const showBackButton = (callback: () => void) => {
    if (webApp) {
      webApp.BackButton.show()
      webApp.BackButton.onClick(callback)
    }
  }

  const hideBackButton = () => {
    if (webApp) {
      webApp.BackButton.hide()
    }
  }

  const showAlert = (message: string) => {
    try {
      if (webApp) {
        webApp.showAlert(message)
      } else {
        alert(message)
      }
    } catch (error) {
      console.warn('Ошибка показа alert:', error)
      alert(message)
    }
  }

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, resolve)
      } else {
        resolve(confirm(message))
      }
    })
  }

  const closeApp = () => {
    if (webApp) {
      webApp.close()
    }
  }

  const sendData = (data: string) => {
    if (webApp) {
      webApp.sendData(data)
    }
  }

  return {
    user,
    webApp,
    isReady,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showAlert,
    showConfirm,
    closeApp,
    sendData
  }
} 