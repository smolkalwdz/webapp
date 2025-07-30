import axios from 'axios'

// Конфигурация API
const API_BASE_URL = '/api/axle-crm' // Относительный путь для Vercel
const API_KEY = '16cda9d095f968b402ff6830a43052e8'

// Флаг для использования мок-данных
const USE_MOCK = false // Реальная интеграция с Axle CRM

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Api-Key': API_KEY
  },
  // Добавляем обработку CORS
  withCredentials: false,
  timeout: 10000
})

// Функции для работы с localStorage
const getMockData = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(`mock_${key}`)
    return stored ? JSON.parse(stored) : defaultValue
  } catch (error) {
    console.error(`Ошибка загрузки мок-данных ${key}:`, error)
    return defaultValue
  }
}

const setMockData = (key: string, data: any) => {
  try {
    localStorage.setItem(`mock_${key}`, JSON.stringify(data))
  } catch (error) {
    console.error(`Ошибка сохранения мок-данных ${key}:`, error)
  }
}

// Мок-данные для тестирования с сохранением в localStorage
const defaultUsers: User[] = [
  // Добавим тестового пользователя для демонстрации
  {
    id: 1,
    client_id: 1,
    telegram_id: 123456789, // Замените на ваш Telegram ID
    first_name: 'Тестовый',
    last_name: 'Пользователь',
    email: 'test@example.com',
    phone: '+7 (999) 123-45-67',
    sex: 'male',
    subscription_sms: true,
    bonus_balance: 1000,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z'
  }
]

let mockUsers: User[] = getMockData('users', defaultUsers)
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Турнир по настольным играм',
    description: 'Увлекательный турнир для любителей настольных игр',
    date: '2025-01-15',
    time: '19:00',
    max_participants: 20,
    current_participants: 12,
    price: 500,
    status: 'active',
    created_at: '2025-01-01T10:00:00Z'
  },
  {
    id: 2,
    title: 'Мастер-класс по кальяну',
    description: 'Научитесь правильно готовить и подавать кальян',
    date: '2025-01-20',
    time: '18:00',
    max_participants: 15,
    current_participants: 8,
    price: 800,
    status: 'active',
    created_at: '2025-01-01T10:00:00Z'
  }
]

const mockPromotions: Promotion[] = [
  {
    id: 1,
    title: 'Акция 5+1',
    description: 'Закажите 5 кальянов и получите 6-й бесплатно!',
    type: 'hookah_5_plus_1',
    is_active: true,
    valid_from: '2025-01-01',
    valid_to: '2025-12-31',
    created_at: '2025-01-01T10:00:00Z'
  }
]

// Мок-данные для администраторов
const defaultAdmins: Admin[] = [
  {
    id: 1,
    telegram_id: 885843500, // Ваш Telegram ID
    first_name: 'Главный',
    last_name: 'Администратор',
    is_main_admin: true,
    created_at: '2025-01-01T10:00:00Z'
  }
]

let mockAdmins: Admin[] = getMockData('admins', defaultAdmins)

// Мок-данные для покупок кальянов
const defaultHookahPurchases: HookahPurchase[] = [
  {
    id: 1,
    guest_id: 1,
    admin_id: 1,
    is_free: false,
    created_at: '2025-01-15T14:30:00Z',
    rating: 5,
    rating_comment: 'Отличный кальян!'
  },
  {
    id: 2,
    guest_id: 1,
    admin_id: 1,
    is_free: false,
    created_at: '2025-01-16T16:45:00Z',
    rating: 4
  },
  {
    id: 3,
    guest_id: 1,
    admin_id: 1,
    is_free: false,
    created_at: '2025-01-17T18:20:00Z'
  },
  {
    id: 4,
    guest_id: 1,
    admin_id: 1,
    is_free: false,
    created_at: '2025-01-18T20:15:00Z'
  },
  {
    id: 5,
    guest_id: 1,
    admin_id: 1,
    is_free: false,
    created_at: '2025-01-19T22:00:00Z'
  }
]

let mockHookahPurchases: HookahPurchase[] = getMockData('hookah_purchases', defaultHookahPurchases)

// Интерфейсы для типизации
export interface User {
  id?: number
  client_id?: number
  telegram_id?: number
  first_name?: string
  last_name?: string
  middle_name?: string
  dob?: string
  sex?: 'male' | 'female'
  phone?: string
  subscription_sms?: boolean
  email?: string
  card_number?: string
  bonus_balance?: number
  comment?: string
  loyalty_id?: number
  cohort_id?: number
  created_at?: string
  updated_at?: string
}

export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  max_participants: number
  current_participants: number
  price?: number
  status: 'active' | 'cancelled' | 'completed'
  created_at: string
}

export interface Booking {
  id?: number
  user_id: number
  event_id: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at?: string
  updated_at?: string
}

export interface Promotion {
  id: number
  title: string
  description: string
  type: 'hookah_5_plus_1' | 'discount' | 'free_drink'
  discount_percent?: number
  is_active: boolean
  valid_from: string
  valid_to: string
  created_at: string
}

// Новые интерфейсы для системы 5+1
export interface HookahPurchase {
  id: number
  guest_id: number
  admin_id?: number
  is_free: boolean
  created_at: string
  rating?: number
  rating_comment?: string
}

export interface HookahStats {
  purchases_count: number
  total_purchases: number
  free_hookahs_available: number
  purchases_until_free: number
  can_claim_free: boolean
}

// Интерфейс для администраторов
export interface Admin {
  id: number
  telegram_id: number
  first_name: string
  last_name: string
  is_main_admin: boolean
  created_at: string
}

// Методы для работы с пользователями
export const userService = {
  // Регистрация нового пользователя
  async register(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    console.log('🚀 Регистрация в Axle CRM:', userData)
    console.log('🔑 API Key:', API_KEY)
    console.log('🌐 API URL:', API_BASE_URL)
    
    try {
      // Формируем данные для Axle CRM согласно документации
      const axelData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        sex: userData.sex,
        subscription_sms: userData.subscription_sms,
        comment: userData.comment || 'Регистрация из веб-приложения'
        // Другие поля (email, card_number, bonus_balance, loyalty_id, cohort_id) не отправляем
        // Они будут заполнены автоматически или значениями по умолчанию
      }
      
      console.log('📤 Отправка в Axle CRM:', axelData)
      console.log('📡 Headers:', api.defaults.headers)
      
      const response = await api.post('/client/add', axelData)
      console.log('✅ Успешная регистрация в Axle CRM:', response.data)
      
      // Возвращаем пользователя с данными из Axle CRM
      return {
        id: response.data.id,
        client_id: response.data.id,
        ...userData,
        created_at: response.data.created_at || new Date().toISOString(),
        updated_at: response.data.updated_at || new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Ошибка регистрации в Axle CRM:', error)
      console.error('📡 Response status:', axios.isAxiosError(error) ? error.response?.status : 'N/A')
      console.error('📡 Response data:', axios.isAxiosError(error) ? error.response?.data : 'N/A')
      console.error('📡 Response headers:', axios.isAxiosError(error) ? error.response?.headers : 'N/A')
      
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        // Пользователь уже существует, получаем его данные
        try {
          const existingUser = await this.getUserFromAxleCrm(userData.telegram_id!)
          if (existingUser) {
            console.log('✅ Пользователь уже существует в Axle CRM:', existingUser)
            return existingUser
          }
        } catch (getError) {
          console.error('Ошибка получения существующего пользователя:', getError)
        }
      }
      
      throw new Error(`Ошибка регистрации: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`)
    }
  },

  // Получение пользователя по Telegram ID
  async getByTelegramId(telegramId: number): Promise<User | null> {
    console.log('🔍 Поиск пользователя с telegram_id:', telegramId)
    
    // Если используем мок-данные, ищем в localStorage
    if (USE_MOCK) {
      mockUsers = getMockData('users', defaultUsers)
      const localUser = mockUsers.find(u => u.telegram_id === telegramId)
      if (localUser) {
        console.log('✅ Пользователь найден в localStorage:', localUser)
        return localUser
      }
      console.log('❌ Пользователь не найден в localStorage')
      return null
    }
    
    // Если не используем мок-данные, ищем только в Axle CRM
    try {
      console.log('🔄 Поиск пользователя в Axle CRM...')
      const axelUser = await this.getUserFromAxleCrm(telegramId)
      if (axelUser) {
        console.log('✅ Пользователь найден в Axle CRM:', axelUser)
        return axelUser
      }
    } catch (error) {
      console.error('❌ Ошибка поиска в Axle CRM:', error)
    }
    
    console.log('❌ Пользователь не найден')
    return null
  },

  // Вспомогательный метод для получения пользователя из Axle CRM
  async getUserFromAxleCrm(telegramId: number): Promise<User | null> {
    try {
      console.log('Поиск пользователя с Telegram ID в Axle CRM:', telegramId)
      const response = await api.get(`/client/telegram/${telegramId}`)
      console.log('Ответ от Axle CRM API:', response.data)
      
      // Преобразуем данные из формата Axle CRM в наш формат
      const axelUser = response.data
      return {
        id: axelUser.id,
        client_id: axelUser.id,
        telegram_id: axelUser.telegram_id,
        first_name: axelUser.first_name,
        last_name: axelUser.last_name,
        phone: axelUser.phone,
        email: axelUser.email,
        sex: axelUser.sex,
        subscription_sms: axelUser.subscription_sms,
        bonus_balance: axelUser.bonus_balance,
        comment: axelUser.comment,
        created_at: axelUser.created_at,
        updated_at: axelUser.updated_at
      }
    } catch (error) {
      console.error('Детальная ошибка получения пользователя из Axle CRM:', error)
      if (axios.isAxiosError(error)) {
        console.error('Статус:', error.response?.status)
        console.error('Данные ответа:', error.response?.data)
        if (error.response?.status === 404) {
          return null
        }
      }
      throw error
    }
  },

  // Функция для принудительной синхронизации с Axle CRM
  async forceSyncWithAxleCrm(telegramId: number): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔄 Принудительная синхронизация с Axle CRM для Telegram ID:', telegramId)
      
      // Получаем пользователя из localStorage
      const localUser = mockUsers.find(u => u.telegram_id === telegramId)
      if (!localUser) {
        return { success: false, message: 'Пользователь не найден в локальной базе' }
      }

      // Пытаемся отправить в Axle CRM
      const axelData = {
        first_name: localUser.first_name,
        last_name: localUser.last_name,
        phone: localUser.phone,
        email: localUser.email,
        sex: localUser.sex,
        subscription_sms: localUser.subscription_sms,
        telegram_id: localUser.telegram_id,
        comment: localUser.comment || 'Синхронизация из Telegram Web App',
        source: 'telegram_webapp'
      }

      console.log('📤 Отправка данных в Axle CRM:', axelData)
      
      try {
        const response = await api.post('/client/add', axelData)
        console.log('✅ Успешная синхронизация с Axle CRM:', response.data)
        
        // Обновляем локальные данные с ID из Axle CRM
        const updatedUser = { ...localUser, id: response.data.id, client_id: response.data.id }
        const userIndex = mockUsers.findIndex(u => u.telegram_id === telegramId)
        if (userIndex !== -1) {
          mockUsers[userIndex] = updatedUser
          setMockData('users', mockUsers)
        }
        
        return { 
          success: true, 
          message: 'Успешная синхронизация с Axle CRM', 
          data: response.data 
        }
      } catch (error: any) {
        console.error('❌ Ошибка синхронизации с Axle CRM:', error)
        
        if (error.response?.status === 409) {
          // Пользователь уже существует, пытаемся получить его данные
          try {
            const existingUser = await this.getUserFromAxleCrm(telegramId)
            if (existingUser) {
              // Обновляем локальные данные
              const userIndex = mockUsers.findIndex(u => u.telegram_id === telegramId)
              if (userIndex !== -1) {
                mockUsers[userIndex] = { ...localUser, ...existingUser }
                setMockData('users', mockUsers)
              }
              return { 
                success: true, 
                message: 'Пользователь уже существует в Axle CRM, данные обновлены', 
                data: existingUser 
              }
            }
          } catch (getError) {
            console.error('Ошибка получения существующего пользователя:', getError)
          }
        }
        
        return { 
          success: false, 
          message: `Ошибка синхронизации: ${error.response?.data?.message || error.message}` 
        }
      }
    } catch (error: any) {
      console.error('❌ Общая ошибка принудительной синхронизации:', error)
      return { 
        success: false, 
        message: `Общая ошибка: ${error.message}` 
      }
    }
  },

  // Получение пользователя по Telegram ID (старый метод для совместимости)
  async getByTelegramIdOld(telegramId: number): Promise<User | null> {
    if (USE_MOCK) {
      console.log('🔍 Поиск пользователя в мок-данных с telegram_id:', telegramId)
      
      // Загружаем актуальные данные из localStorage
      mockUsers = getMockData('users', defaultUsers)
      
      console.log('📋 Все пользователи в мок-данных:', mockUsers)
      const user = mockUsers.find(u => u.telegram_id === telegramId)
      console.log('✅ Найден пользователь:', user)
      return user || null
    }

    try {
      console.log('Поиск пользователя с Telegram ID в Axle CRM:', telegramId)
      const response = await api.get(`/client/telegram/${telegramId}`)
      console.log('Ответ от Axle CRM API:', response.data)
      
      // Преобразуем данные из формата Axle CRM в наш формат
      const axelUser = response.data
      return {
        id: axelUser.id,
        client_id: axelUser.id,
        telegram_id: axelUser.telegram_id,
        first_name: axelUser.first_name,
        last_name: axelUser.last_name,
        phone: axelUser.phone,
        email: axelUser.email,
        sex: axelUser.sex,
        subscription_sms: axelUser.subscription_sms,
        bonus_balance: axelUser.bonus_balance,
        comment: axelUser.comment,
        created_at: axelUser.created_at,
        updated_at: axelUser.updated_at
      }
    } catch (error) {
      console.error('Детальная ошибка получения пользователя из Axle CRM:', error)
      if (axios.isAxiosError(error)) {
        console.error('Статус:', error.response?.status)
        console.error('Данные ответа:', error.response?.data)
        if (error.response?.status === 404) {
          return null
        }
      }
      throw error
    }
  },

  // Обновление данных пользователя
  async update(telegramId: number, userData: Partial<User>): Promise<User> {
    if (USE_MOCK) {
      const userIndex = mockUsers.findIndex(u => u.telegram_id === telegramId)
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData, updated_at: new Date().toISOString() }
        return mockUsers[userIndex]
      }
      throw new Error('Пользователь не найден')
    }

    try {
      const response = await api.put(`/users/telegram/${telegramId}`, userData)
      return response.data
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error)
      throw new Error('Не удалось обновить данные пользователя')
    }
  },

  // Проверка существования пользователя
  async exists(telegramId: number): Promise<boolean> {
    try {
      const user = await this.getByTelegramId(telegramId)
      return user !== null
    } catch (error) {
      return false
    }
  },

  // Получение всех пользователей
  async getAllUsers(): Promise<User[]> {
    if (USE_MOCK) {
      // Загружаем актуальные данные из localStorage
      mockUsers = getMockData('users', defaultUsers)
      return mockUsers
    }

    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      console.error('Ошибка получения всех пользователей:', error)
      return []
    }
  }
}

// Методы для работы с мероприятиями
export const eventService = {
  // Получение всех активных мероприятий
  async getActive(): Promise<Event[]> {
    if (USE_MOCK) {
      return mockEvents.filter(event => event.status === 'active')
    }

    try {
      const response = await api.get('/events?status=active')
      return response.data
    } catch (error) {
      console.error('Ошибка получения мероприятий:', error)
      throw new Error('Не удалось получить список мероприятий')
    }
  },

  // Получение мероприятия по ID
  async getById(id: number): Promise<Event> {
    if (USE_MOCK) {
      const event = mockEvents.find(e => e.id === id)
      if (!event) throw new Error('Мероприятие не найдено')
      return event
    }

    try {
      const response = await api.get(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Ошибка получения мероприятия:', error)
      throw new Error('Не удалось получить данные мероприятия')
    }
  },

  // Получение мероприятий пользователя
  async getUserEvents(telegramId: number): Promise<Event[]> {
    if (USE_MOCK) {
      // Возвращаем все активные мероприятия для демонстрации
      return mockEvents.filter(event => event.status === 'active')
    }

    try {
      const response = await api.get(`/users/telegram/${telegramId}/events`)
      return response.data
    } catch (error) {
      console.error('Ошибка получения мероприятий пользователя:', error)
      throw new Error('Не удалось получить ваши мероприятия')
    }
  }
}

// Методы для работы с бронированиями
export const bookingService = {
  // Создание бронирования
  async create(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    if (USE_MOCK) {
      const newBooking: Booking = {
        ...bookingData,
        id: Math.floor(Math.random() * 1000),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return newBooking
    }

    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error) {
      console.error('Ошибка создания бронирования:', error)
      throw new Error('Не удалось создать бронирование')
    }
  },

  // Получение бронирований пользователя
  async getUserBookings(telegramId: number): Promise<Booking[]> {
    if (USE_MOCK) {
      // Возвращаем пустой массив для демонстрации
      return []
    }

    try {
      const response = await api.get(`/users/telegram/${telegramId}/bookings`)
      return response.data
    } catch (error) {
      console.error('Ошибка получения бронирований:', error)
      throw new Error('Не удалось получить ваши бронирования')
    }
  },

  // Отмена бронирования
  async cancel(bookingId: number): Promise<Booking> {
    if (USE_MOCK) {
      return {
        id: bookingId,
        user_id: 1,
        event_id: 1,
        status: 'cancelled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`)
      return response.data
    } catch (error) {
      console.error('Ошибка отмены бронирования:', error)
      throw new Error('Не удалось отменить бронирование')
    }
  },

  // Проверка доступности места на мероприятии
  async checkAvailability(eventId: number): Promise<boolean> {
    try {
      const event = await eventService.getById(eventId)
      return event.current_participants < event.max_participants
    } catch (error) {
      return false
    }
  }
}

// Методы для работы с акциями
export const promotionService = {
  // Получение активных акций
  async getActive(): Promise<Promotion[]> {
    if (USE_MOCK) {
      return mockPromotions.filter(promo => promo.is_active)
    }

    try {
      const response = await api.get('/promotions?is_active=true')
      return response.data
    } catch (error) {
      console.error('Ошибка получения акций:', error)
      throw new Error('Не удалось получить список акций')
    }
  },

  // Получение акции 5+1
  async getHookahPromotion(): Promise<Promotion | null> {
    if (USE_MOCK) {
      return mockPromotions.find(promo => promo.type === 'hookah_5_plus_1' && promo.is_active) || null
    }

    try {
      const response = await api.get('/promotions?type=hookah_5_plus_1&is_active=true')
      const promotions = response.data
      return promotions.length > 0 ? promotions[0] : null
    } catch (error) {
      console.error('Ошибка получения акции 5+1:', error)
      return null
    }
  },

  // Активация акции для пользователя
  async activatePromotion(telegramId: number, promotionId: number): Promise<boolean> {
    if (USE_MOCK) {
      // Всегда успешно для демонстрации
      return true
    }

    try {
      const response = await api.post(`/users/telegram/${telegramId}/promotions/${promotionId}/activate`)
      return response.data.success
    } catch (error) {
      console.error('Ошибка активации акции:', error)
      return false
    }
  }
}

// Общие методы
export const apiService = {
  // Проверка подключения к API
  async healthCheck(): Promise<boolean> {
    if (USE_MOCK) {
      return true
    }

    try {
      console.log('Проверка подключения к Axle CRM API...')
      
      // Попробуем несколько вариантов проверки
      const endpoints = ['/', '/health', '/client/add', '/client/telegram/123456789']
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Пробуем эндпоинт: ${endpoint}`)
          const response = await api.get(endpoint)
          console.log(`✅ Эндпоинт ${endpoint} доступен, статус:`, response.status)
          return true
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status
            console.log(`❌ Эндпоинт ${endpoint} недоступен, статус:`, status)
            
            // Если получаем 401 (Unauthorized), это означает, что API работает, но нужна авторизация
            if (status === 401) {
              console.log('✅ Axle CRM API работает, но требуется авторизация')
              return true
            }
            
            // Если получаем 404 (Not Found), это означает, что эндпоинт не существует, но сервер работает
            if (status === 404) {
              console.log('✅ Axle CRM API работает, но эндпоинт не найден')
              return true
            }
            
            // Если получаем 405 (Method Not Allowed), это означает, что сервер работает
            if (status === 405) {
              console.log('✅ Axle CRM API работает, но метод не поддерживается')
              return true
            }
          }
        }
      }
      
      console.log('❌ Все эндпоинты недоступны')
      return false
    } catch (error) {
      console.error('Ошибка проверки здоровья Axle CRM API:', error)
      return false
    }
  },

  // Обработка ошибок
  handleError(error: any): string {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 401) {
        return 'Ошибка авторизации. Проверьте API ключ.'
      }
      if (status === 404) {
        return 'Запрашиваемый ресурс не найден.'
      }
      if (status === 422) {
        return 'Ошибка валидации данных.'
      }
      if (status && status >= 500) {
        return 'Ошибка сервера. Попробуйте позже.'
      }
      return error.response?.data?.message || 'Произошла ошибка при запросе.'
    }
    return 'Неизвестная ошибка.'
  }
}

// Сервис для работы с кальянами (система 5+1)
export const hookahService = {
  // Получение статистики пользователя
  async getStats(telegramId: number): Promise<HookahStats> {
    if (USE_MOCK) {
      // Загружаем актуальные данные из localStorage
      mockUsers = getMockData('users', defaultUsers)
      mockHookahPurchases = getMockData('hookah_purchases', defaultHookahPurchases)
      
      const user = mockUsers.find(u => u.telegram_id === telegramId)
      if (!user) {
        throw new Error('Пользователь не найден')
      }
      
      const userPurchases = mockHookahPurchases.filter(p => p.guest_id === (user.id || 0))
      const purchasesCount = userPurchases.filter(p => !p.is_free).length
      const totalPurchases = userPurchases.length
      const freeHookahsAvailable = Math.floor(purchasesCount / 5)
      const purchasesUntilFree = 5 - (purchasesCount % 5)
      
      return {
        purchases_count: purchasesCount,
        total_purchases: totalPurchases,
        free_hookahs_available: freeHookahsAvailable,
        purchases_until_free: purchasesUntilFree,
        can_claim_free: freeHookahsAvailable > 0
      }
    }

    try {
      const response = await api.get(`/hookah/stats/${telegramId}`)
      return response.data
    } catch (error) {
      console.error('Ошибка получения статистики кальянов:', error)
      throw new Error('Не удалось получить статистику')
    }
  },

  // Получение истории покупок
  async getPurchaseHistory(telegramId: number): Promise<HookahPurchase[]> {
    if (USE_MOCK) {
      const user = mockUsers.find(u => u.telegram_id === telegramId)
      if (!user) {
        return []
      }
      
      return mockHookahPurchases
        .filter(p => p.guest_id === (user.id || 0))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    try {
      const response = await api.get(`/hookah/history/${telegramId}`)
      return response.data
    } catch (error) {
      console.error('Ошибка получения истории покупок:', error)
      throw new Error('Не удалось получить историю покупок')
    }
  },

  // Запрос бесплатного кальяна
  async claimFreeHookah(telegramId: number): Promise<boolean> {
    if (USE_MOCK) {
      const user = mockUsers.find(u => u.telegram_id === telegramId)
      if (!user) {
        throw new Error('Пользователь не найден')
      }
      
      const stats = await this.getStats(telegramId)
      if (!stats.can_claim_free) {
        throw new Error('Недостаточно покупок для бесплатного кальяна')
      }
      
      // Уведомляем всех администраторов
      const admins = mockAdmins
      for (const admin of admins) {
        console.log(`🔔 Уведомление администратору ${admin.first_name} ${admin.last_name} (${admin.telegram_id}):`)
        console.log(`   Гость ${user.first_name} ${user.last_name} (${user.phone}) хочет получить бесплатный кальян!`)
        console.log(`   Telegram ID: ${user.telegram_id}`)
        console.log(`   Доступно бесплатных кальянов: ${stats.free_hookahs_available}`)
      }
      
      return true
    }

    try {
      const response = await api.post(`/hookah/claim-free/${telegramId}`)
      return response.data.success
    } catch (error) {
      console.error('Ошибка запроса бесплатного кальяна:', error)
      throw new Error('Не удалось запросить бесплатный кальян')
    }
  },

  // Подтверждение бесплатного кальяна администратором
  async confirmFreeHookah(adminTelegramId: number, guestTelegramId: number): Promise<boolean> {
    if (USE_MOCK) {
      const admin = mockAdmins.find(a => a.telegram_id === adminTelegramId)
      const guest = mockUsers.find(u => u.telegram_id === guestTelegramId)
      
      if (!admin) {
        throw new Error('У вас нет прав администратора')
      }
      
      if (!guest) {
        throw new Error('Гость не найден')
      }
      
      const stats = await this.getStats(guestTelegramId)
      if (!stats.can_claim_free) {
        throw new Error('У гостя нет доступных бесплатных кальянов')
      }
      
      // Добавляем бесплатный кальян
      const newPurchase: HookahPurchase = {
        id: mockHookahPurchases.length + 1,
        guest_id: guest.id || 0,
        admin_id: admin.id,
        is_free: true,
        created_at: new Date().toISOString()
      }
      
      mockHookahPurchases.push(newPurchase)
      console.log(`✅ Администратор ${admin.first_name} подтвердил бесплатный кальян для ${guest.first_name} ${guest.last_name}`)
      
      // Уведомляем других администраторов
      const otherAdmins = mockAdmins.filter(a => a.telegram_id !== adminTelegramId)
      for (const otherAdmin of otherAdmins) {
        console.log(`🔔 Уведомление администратору ${otherAdmin.first_name} ${otherAdmin.last_name}:`)
        console.log(`   Администратор ${admin.first_name} подтвердил бесплатный кальян для ${guest.first_name} ${guest.last_name}`)
      }
      
      return true
    }

    try {
      const response = await api.post('/admin/hookah/confirm-free', {
        admin_telegram_id: adminTelegramId,
        guest_telegram_id: guestTelegramId
      })
      return response.data.success
    } catch (error) {
      console.error('Ошибка подтверждения бесплатного кальяна:', error)
      throw new Error('Не удалось подтвердить бесплатный кальян')
    }
  },

  // Удаление последней покупки (для админов)
  async deleteLastPurchase(adminTelegramId: number, guestPhone: string): Promise<boolean> {
    if (USE_MOCK) {
      const admin = mockAdmins.find(a => a.telegram_id === adminTelegramId)
      const guest = mockUsers.find(u => u.phone === guestPhone)
      
      if (!admin) {
        throw new Error('У вас нет прав администратора')
      }
      
      if (!guest) {
        throw new Error('Гость не найден')
      }
      
      const userPurchases = mockHookahPurchases.filter(p => p.guest_id === (guest.id || 0))
      if (userPurchases.length === 0) {
        throw new Error('У этого гостя нет покупок')
      }
      
      // Удаляем последнюю покупку
      const lastPurchase = userPurchases.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]
      
      const purchaseIndex = mockHookahPurchases.findIndex(p => p.id === lastPurchase.id)
      if (purchaseIndex !== -1) {
        mockHookahPurchases.splice(purchaseIndex, 1)
        console.log(`Администратор ${admin.first_name} удалил покупку для ${guest.first_name} ${guest.last_name}`)
        return true
      }
      
      return false
    }

    try {
      const response = await api.delete('/admin/hookah/purchase', {
        data: {
          admin_telegram_id: adminTelegramId,
          guest_phone: guestPhone
        }
      })
      return response.data.success
    } catch (error) {
      console.error('Ошибка удаления покупки:', error)
      throw new Error('Не удалось удалить покупку')
    }
  },

  // Добавление покупки (для админов)
  async addPurchase(telegramId: number, guestPhone: string): Promise<HookahPurchase> {
    if (USE_MOCK) {
      const guest = mockUsers.find(u => u.phone === guestPhone)
      if (!guest) {
        throw new Error('Гость не найден')
      }
      
      const newPurchase: HookahPurchase = {
        id: mockHookahPurchases.length + 1,
        guest_id: guest.id,
        admin_id: 1, // Мок-админ
        is_free: false,
        created_at: new Date().toISOString()
      }
      
      mockHookahPurchases.push(newPurchase)
      console.log(`Добавлена покупка для ${guest.first_name} ${guest.last_name}`)
      return newPurchase
    }

    try {
      const response = await api.post('/hookah/purchase', {
        guest_phone: guestPhone,
        admin_telegram_id: telegramId
      })
      return response.data
    } catch (error) {
      console.error('Ошибка добавления покупки:', error)
      throw new Error('Не удалось добавить покупку')
    }
  }
}

// Сервис для администраторов
export const adminService = {
  // Проверка, является ли пользователь администратором
  async isAdmin(telegramId: number): Promise<boolean> {
    if (USE_MOCK) {
      return mockAdmins.some(admin => admin.telegram_id === telegramId)
    }

    try {
      const response = await api.get(`/admin/check/${telegramId}`)
      return response.data.is_admin
    } catch (error) {
      console.error('Ошибка проверки администратора:', error)
      return false
    }
  },

  // Получение информации об администраторе
  async getAdmin(telegramId: number): Promise<Admin | null> {
    if (USE_MOCK) {
      return mockAdmins.find(admin => admin.telegram_id === telegramId) || null
    }

    try {
      const response = await api.get(`/admin/${telegramId}`)
      return response.data
    } catch (error) {
      console.error('Ошибка получения администратора:', error)
      return null
    }
  },

  // Поиск пользователя по последним 4 цифрам телефона
  async findUserByPhoneLast4(last4: string): Promise<User[]> {
    if (USE_MOCK) {
      return mockUsers.filter(user => 
        user.phone && user.phone.replace(/\D/g, '').endsWith(last4)
      )
    }

    try {
      const response = await api.get(`/users/search?phone_last4=${last4}`)
      return response.data
    } catch (error) {
      console.error('Ошибка поиска пользователя:', error)
      return []
    }
  },

  // Управление администраторами (только для главного админа)
  async addAdmin(mainAdminTelegramId: number, newAdminTelegramId: number, role: string = 'admin'): Promise<boolean> {
    if (USE_MOCK) {
      const mainAdmin = mockAdmins.find(a => a.telegram_id === mainAdminTelegramId && a.is_main_admin)
      if (!mainAdmin) {
        throw new Error('У вас нет прав главного администратора')
      }
      
      const existingAdmin = mockAdmins.find(a => a.telegram_id === newAdminTelegramId)
      if (existingAdmin) {
        throw new Error('Этот пользователь уже является администратором')
      }
      
      const newAdminUser = mockUsers.find(u => u.telegram_id === newAdminTelegramId)
      if (!newAdminUser) {
        throw new Error('Пользователь не найден')
      }
      
      const newAdmin: Admin = {
        id: mockAdmins.length + 1,
        telegram_id: newAdminTelegramId,
        first_name: newAdminUser.first_name || '',
        last_name: newAdminUser.last_name || '',
        is_main_admin: false,
        created_at: new Date().toISOString()
      }
      
      mockAdmins.push(newAdmin)
      console.log(`Главный администратор ${mainAdmin.first_name} добавил администратора ${newAdminUser.first_name} ${newAdminUser.last_name}`)
      return true
    }

    try {
      const response = await api.post('/admin/add', {
        main_admin_telegram_id: mainAdminTelegramId,
        new_admin_telegram_id: newAdminTelegramId,
        role: role
      })
      return response.data.success
    } catch (error) {
      console.error('Ошибка добавления администратора:', error)
      throw new Error('Не удалось добавить администратора')
    }
  },

  async removeAdmin(mainAdminTelegramId: number, adminTelegramId: number): Promise<boolean> {
    if (USE_MOCK) {
      const mainAdmin = mockAdmins.find(a => a.telegram_id === mainAdminTelegramId && a.is_main_admin)
      if (!mainAdmin) {
        throw new Error('У вас нет прав главного администратора')
      }
      
      const adminToRemove = mockAdmins.find(a => a.telegram_id === adminTelegramId)
      if (!adminToRemove) {
        throw new Error('Администратор не найден')
      }
      
      if (adminToRemove.is_main_admin) {
        throw new Error('Нельзя удалить главного администратора')
      }
      
      const adminIndex = mockAdmins.findIndex(a => a.telegram_id === adminTelegramId)
      if (adminIndex !== -1) {
        mockAdmins.splice(adminIndex, 1)
        console.log(`Главный администратор ${mainAdmin.first_name} удалил администратора ${adminToRemove.first_name} ${adminToRemove.last_name}`)
        return true
      }
      
      return false
    }

    try {
      const response = await api.delete('/admin/remove', {
        data: {
          main_admin_telegram_id: mainAdminTelegramId,
          admin_telegram_id: adminTelegramId
        }
      })
      return response.data.success
    } catch (error) {
      console.error('Ошибка удаления администратора:', error)
      throw new Error('Не удалось удалить администратора')
    }
  },

  async getAllAdmins(): Promise<Admin[]> {
    if (USE_MOCK) {
      return mockAdmins
    }

    try {
      const response = await api.get('/admin/list')
      return response.data
    } catch (error) {
      console.error('Ошибка получения списка администраторов:', error)
      return []
    }
  },

  // Добавление покупки кальяна администратором
  async addHookahPurchase(adminTelegramId: number, guestPhone: string): Promise<HookahPurchase> {
    if (USE_MOCK) {
      // Загружаем актуальные данные из localStorage
      mockUsers = getMockData('users', defaultUsers)
      mockAdmins = getMockData('admins', defaultAdmins)
      mockHookahPurchases = getMockData('hookah_purchases', defaultHookahPurchases)
      
      const admin = mockAdmins.find(a => a.telegram_id === adminTelegramId)
      if (!admin) {
        throw new Error('У вас нет прав администратора')
      }

      const guest = mockUsers.find(u => u.phone === guestPhone)
      if (!guest) {
        throw new Error('Гость не найден')
      }

      const newPurchase: HookahPurchase = {
        id: mockHookahPurchases.length + 1,
        guest_id: guest.id || 0,
        admin_id: admin.id,
        is_free: false,
        created_at: new Date().toISOString()
      }

      mockHookahPurchases.push(newPurchase)
      
      // Сохраняем обновленные данные в localStorage
      setMockData('hookah_purchases', mockHookahPurchases)
      
      console.log(`Администратор ${admin.first_name} добавил покупку для ${guest.first_name} ${guest.last_name}`)
      return newPurchase
    }

    try {
      const response = await api.post('/admin/hookah/purchase', {
        admin_telegram_id: adminTelegramId,
        guest_phone: guestPhone
      })
      return response.data
    } catch (error) {
      console.error('Ошибка добавления покупки:', error)
      throw new Error('Не удалось добавить покупку')
    }
  }
}

export default {
  userService,
  eventService,
  bookingService,
  promotionService,
  apiService,
  hookahService,
  adminService
} 